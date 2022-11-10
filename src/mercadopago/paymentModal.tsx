import { ReactElement, useEffect, useState } from "react";
import useMercadopago from ".";
import MercadoPagoAPI from "../api/mercadopago";
import { Alert, Form, Input, Select } from "../components";
import { normalizeCreditCard, normalizeCreditCardValidate, normalizeDocument } from "../helpers";
import { ALERT, DOCS } from "../interfaces/enums";
import { EventType, UUID } from '../interfaces/types';
import { MercadoPago } from "./protocols";
import {
  PaymentCardTokenType,
  PaymentCreateCardTokenType,
  PaymentDataType,
  PaymentFormType,
  PaymentIdentificationsType,
  PaymentInstallmentsType,
  PaymentIssuersType,
  PaymentMethodsType,
} from "./types";

const MERCADO_PAGO_PUBLIC_KEY =
  process.env.REACT_APP_MERCADO_PAGO_PUBLIC_KEY_TEST || "";

type PaymentModalProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  setLoading: (loading: boolean) => void;
  setAlert: (alert: string) => void;
  event: EventType;
  profileID: UUID;
  forceReload: () => Promise<void>;
};

const initialPayment: PaymentFormType = {
  cardholderName: "",
  documentType: "",
  document: "",
  cardNumber: "",
  cardExpiration: "",
  securityCode: "",
  paymentOption: "",
  installmentOptions: undefined,
  paymentMethod: undefined,
  issuer: undefined,
};

const PaymentModal = ({
  open,
  setOpen,
  setLoading,
  setAlert,
  event,
  profileID,
  forceReload
}: PaymentModalProps): ReactElement => {
  const mercadopago = useMercadopago(MERCADO_PAGO_PUBLIC_KEY, { locale: "pt-BR" }) as MercadoPago;
  const [error, setError] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [formPayment, setFormPayment] = useState<PaymentFormType>(initialPayment);
  const [identificationTypes, setIdentificationTypes] = useState<PaymentIdentificationsType>();
  const [cardImg, setCardImg] = useState("");

  const validadeForm = (f: PaymentFormType) => {
    if (
      !f.cardholderName ||
      !f.documentType ||
      !f.document ||
      !f.cardNumber ||
      !f.cardExpiration ||
      !f.securityCode ||
      !f.paymentOption
    ) {
      setErrorMsg("Preencha os campos obrigatórios!");
      return false;
    }
    if (
      (f.documentType === DOCS.CPF && f.document.length < 14) ||
      (f.documentType === DOCS.CNPJ && f.document.length < 18)
    ) {
      setErrorMsg(f.documentType === DOCS.CPF ? "CPF inválido!" : "CNPJ inválido");
      return false;
    }

    if (f.cardNumber.replace(/[^\d]/g, "").length < 15) {
      setErrorMsg("Número do Cartão Inválido!");
      return false;
    }
    if (f.cardExpiration.replace(/[^\d]/g, "").length < 4) {
      setErrorMsg("Data de Validade Inválida!");
      return false;
    }
    if (f.securityCode.replace(/[^\d]/g, "").length < 3) {
      setErrorMsg("Código de Seguraça Inválido!");
      return false;
    }
    return true;
  }

  const getCardData = async (card: string): Promise<void> => {
    if (card) {
      const bin = card.replace(/\D/g, "").substring(0, 6);
      if (bin && bin.length === 6) {
        const paymentMethods = (await mercadopago.getPaymentMethods({
          bin,
        })) as PaymentMethodsType;
        if (paymentMethods.results.length > 0) {
          const paymentMethod = paymentMethods.results[0];
          const issuers = (await mercadopago.getIssuers({
            paymentMethodId: paymentMethod.id,
            bin,
          })) as PaymentIssuersType;
          const issuer = issuers[0];
          const installments = (await mercadopago.getInstallments({
            amount: event?.plan?.price.toLocaleString(),
            bin,
            paymentTypeId: "credit_card",
          })) as PaymentInstallmentsType;
          const installmentOptions = installments[0].payer_costs;
          setFormPayment({
            ...formPayment,
            paymentMethod,
            issuer,
            installmentOptions,
          });
          setCardImg(issuer.secure_thumbnail);
        } else {
          setCardImg("");
        }
      }
    }
  };

  const getIdentificationTypes = async (mp: MercadoPago): Promise<void> => {
    const res =
      (await mp.getIdentificationTypes()) as PaymentIdentificationsType;
    setIdentificationTypes(res);
  };

  useEffect(() => {
    if (mercadopago) getIdentificationTypes(mercadopago);
  }, [mercadopago]);

  const getCardToken = async (
    data: PaymentCreateCardTokenType
  ): Promise<PaymentCardTokenType> => {
    try {
      return await mercadopago.createCardToken({
        cardNumber: data.cardNumber,
        cardholderName: data.cardholderName,
        cardExpirationMonth: data.cardExpirationMonth,
        cardExpirationYear: data.cardExpirationYear,
        securityCode: data.securityCode,
        identificationType: data.identificationType,
        identificationNumber: data.identificationNumber,
      });
    } catch (err: any) {
      console.log(err);
      return {} as PaymentCardTokenType;
    }
  };

  const handlePayment = async () => {
    setErrorMsg("");
    setError(false);
    setLoading(true);
    setAlert("");
    if (!validadeForm({ ...formPayment })) {
      setError(true);
      setLoading(false);
      return false;
    }
    const cardToken = await getCardToken({
      cardNumber: formPayment?.cardNumber?.replace(/\D/g, "") || "",
      cardholderName: formPayment?.cardholderName || "",
      cardExpirationMonth: formPayment?.cardExpiration?.split("/")[0] || "",
      cardExpirationYear: `20${formPayment?.cardExpiration?.split("/")[1]}` || "",
      securityCode: formPayment?.securityCode || "",
      identificationType: formPayment?.documentType || "",
      identificationNumber: formPayment?.document?.replace(/\D/g, "") || "",
    });
    const paymentData: PaymentDataType = {
      cardholderName: formPayment?.cardholderName as string,
      installments: Number(formPayment.paymentOption),
      issuer_id: formPayment?.issuer?.id as string,
      identification: {
        type: formPayment.documentType as string,
        number: formPayment.document as string,
      },
      payment_method_id: formPayment?.paymentMethod?.id as string,
      token: cardToken.id,
      profileID: profileID,
      eventID: event.eventID as UUID,
    }
    const res = await MercadoPagoAPI.paymentPost(paymentData);
    setFormPayment(initialPayment);
    await forceReload();
    if (res?.payment?.status !== "approved") setAlert("Não foi possível efetuar o pagamento, tente novamente.");
    setOpen(!open);
    setLoading(false);
  };

  return (
    <div
      className={`${
        open ? "fixed" : "hidden"
      } overflow-y-auto overflow-x-hidden top-0 right-0 left-0 z-30 inset-0 h-full bg-black bg-opacity-50`}
    >
      <div className="flex justify-center items-center w-full h-full">
        <div className="relative w-full max-w-4xl md:h-auto">
          <div className="relative bg-white mx-4 sm:mx-0 rounded-md shadow-md">
            <button
              type="button"
              className="absolute top-1 right-1"
              onClick={() => setOpen(!open)}
            >
              <i className="bx bx-x text-2xl" />
              <span className="sr-only">Close modal</span>
            </button>
            <div className="p-6 text-center">
            {error && <Alert type={ALERT.ERROR} text={errorMsg} />}
              <h1 className="font-bold">{`Evento: ${event.name}`}</h1>
              <h2 className="font-bold -mb-4">{`Plano: ${event.plan?.name} - R$ ${event.plan?.price},00`}</h2>
              <Form>
                <div className="w-full md:w-4/12 sm:pr-4 mb-4">
                  <Input
                    type="text"
                    placeholder="Titular do Cartão *"
                    value={formPayment?.cardholderName || ""}
                    handler={(e) =>
                      setFormPayment({
                        ...formPayment,
                        cardholderName: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="w-full md:w-4/12 sm:pr-4 mb-4">
                  <Select
                    value={formPayment?.documentType || ""}
                    handler={(e) =>
                      setFormPayment({
                        ...formPayment,
                        documentType: e.target.value,
                      })
                    }
                    placeholder="Tipo do Documento *"
                  >
                    <>
                      <option value="">Tipo do Documento *</option>
                      {identificationTypes &&
                        identificationTypes.length > 0 &&
                        identificationTypes.map((type, i) => (
                          <option key={i} value={type.id}>
                            {type.name}
                          </option>
                        ))}
                    </>
                  </Select>
                </div>
                <div className="w-full md:w-4/12 mb-4">
                  <Input
                    type="text"
                    placeholder={`${formPayment.documentType || "Documento"} *`}
                    value={formPayment?.document || ""}
                    handler={(e) =>
                      setFormPayment({
                        ...formPayment,
                        document: normalizeDocument(
                          formPayment.documentType as DOCS,
                          e.target.value
                        ),
                      })
                    }
                  />
                </div>
                <div className="w-full md:w-4/12 sm:pr-4 mb-4 relative">
                  <Input
                    type="text"
                    placeholder="Número do Cartão *"
                    value={formPayment?.cardNumber || ""}
                    handlerBlur={(e) => getCardData(e.target.value)}
                    handler={(e) =>
                      setFormPayment({
                        ...formPayment,
                        cardNumber: normalizeCreditCard(e.target.value),
                      })
                    }
                  />
                  <div className="absolute top-2 right-6">
                    {cardImg !== "" && <img src={cardImg} alt="card banner" />}
                  </div>
                </div>
                <div className="w-full md:w-4/12 sm:pr-4 mb-4">
                  <Input
                    type="text"
                    placeholder="Validade *"
                    value={formPayment?.cardExpiration || ""}
                    handler={(e) =>
                      setFormPayment({
                        ...formPayment,
                        cardExpiration: normalizeCreditCardValidate(e.target.value),
                      })
                    }
                  />
                </div>
                <div className="w-full md:w-4/12 mb-4">
                  <Input
                    type="number"
                    placeholder="Código de Segurança *"
                    value={formPayment?.securityCode || ""}
                    handler={(e) =>
                      setFormPayment({
                        ...formPayment,
                        securityCode: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="w-full md:w-6/12 mb-4 xs:mb-0">
                  <Select
                    value={formPayment?.paymentOption || ""}
                    handler={(e) =>
                      setFormPayment({
                        ...formPayment,
                        paymentOption: e.target.value,
                      })
                    }
                    placeholder="Tipo do Documento *"
                  >
                    <>
                      <option value="">Opções de Pagamento *</option>
                      {formPayment?.installmentOptions &&
                        formPayment.installmentOptions.length > 0 &&
                        formPayment.installmentOptions.map((o) => (
                          <option
                            key={o.installment_amount}
                            value={o.installments}
                          >
                            {o.recommended_message}
                          </option>
                        ))}
                    </>
                  </Select>
                </div>

                <div className="w-full md:w-6/12">
                  <button
                    type="button"
                    className={`text-white bg-primary font-bold rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center`}
                    onClick={() => handlePayment()}
                  >
                    Realizar Pagamento
                  </button>
              </div>
              </Form>
              {process.env.NODE_ENV === "development" && (
                <div>
                  Usuários Teste<br />
                  APRO | OTHE | (CPF) 12345678909<br />
                  5031 4332 1540 6351 -  11/25 - 123<br />
                  4235 6477 2802 5682 - 11/25 - 123 <br />
                  3753 651535 56885 - 11/25 - 1234 <br />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;
