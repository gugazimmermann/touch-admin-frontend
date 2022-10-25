import { useEffect, useState } from "react";
import { PlanType } from "../../interfaces/types";
import { Input, LoadingSmall, Select } from "../../components";
import { MercadoPago } from "../../mercadopago/protocols";
import {
  PaymentFormType,
  PaymentIdentificationsType,
  PaymentInstallmentsType,
  PaymentIssuersType,
  PaymentMethodsType,
} from "../../mercadopago/types";

type EventFormStepThreeProps = {
  mercadopago: MercadoPago;
  formPayment: PaymentFormType;
  setFormPayment: (formPayment: PaymentFormType) => void;
  plan: PlanType;
};

const EventFormStepFour = ({
  mercadopago,
  formPayment,
  setFormPayment,
  plan,
}: EventFormStepThreeProps) => {
  const [identificationTypes, setIdentificationTypes] = useState<PaymentIdentificationsType>();
  const [cardImg, setCardImg] = useState("");

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
            amount: plan.price.toLocaleString(),
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

  return (
    <div className="flex flex-wrap w-full">
      {!mercadopago ? (
        <LoadingSmall />
      ) : (
        <>
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
                setFormPayment({ ...formPayment, documentType: e.target.value })
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
              placeholder="Documento *"
              value={formPayment?.document || ""}
              handler={(e) =>
                setFormPayment({ ...formPayment, document: e.target.value })
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
                setFormPayment({ ...formPayment, cardNumber: e.target.value })
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
                  cardExpiration: e.target.value,
                })
              }
            />
          </div>
          <div className="w-full md:w-4/12 mb-4">
            <Input
              type="text"
              placeholder="Código de Segurança *"
              value={formPayment?.securityCode || ""}
              handler={(e) =>
                setFormPayment({ ...formPayment, securityCode: e.target.value })
              }
            />
          </div>
          <div className="w-full md:w-6/12 mb-4">
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
                    <option key={o.installment_amount} value={o.installments}>
                      {o.recommended_message}
                    </option>
                  ))}
              </>
            </Select>
          </div>
        </>
      )}
      {process.env.NODE_ENV === "development" && (
        <div>
          Usuários Development
          <br />
          APRO | OTHE | (CPF) 12345678909
          <br />
          5031 4332 1540 6351 - 123 - 11/25
          <br />
          4235 6477 2802 5682 - 123 - 11/25 <br />
          3753 651535 56885 - 1234 - 11/25 <br />
        </div>
      )}
    </div>
  );
};

export default EventFormStepFour;
