import { useCallback, useContext, useEffect, useState } from "react";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import { DateTime } from "luxon";
import MDEditor from "@uiw/react-md-editor";
import rehypeSanitize from "rehype-sanitize";
import {
  ROUTES,
  PLANSTYPES,
  ALERT,
  BrazilStates,
  FILEERROR,
  FILETYPES,
} from "../../interfaces/enums";
import {
  createMap,
  getAddressFromCEP,
  normalizeCEP,
  normalizeWebsite,
  validateEmail,
  validateFile,
} from "../../helpers";
import DatePicker from "react-multi-date-picker";
import {
  Form,
  Input,
  Select,
  InputFile,
  Uploading,
  Title,
  Alert,
} from "../../components";
import {
  EventType,
  PlanType,
  useOutletContextProfileProps,
} from "../../interfaces/types";
import PlansAPI from "../../api/plans";
import slugify from "slugify";
import ReferralsAPI from "../../api/referral";
import EventsAPI from "../../api/events";
import { AppContext } from "../../context";
import { sendPublicFile } from "../../api/storage";

const initial = {
  name: "",
  email: "",
  website: "",
  zipCode: "",
  state: "",
  city: "",
  district: "",
  street: "",
  number: "",
  complement: "",
  dates: [],
  referralCode: "",
  method: "",
  gift: "",
  giftDescription: "",
  prizeDraw: "",
  prizeDrawDescription: "",
  description: "",
  map: "",
  logo: "",
};

export default function EventForm() {
  const navigate = useNavigate();
  const params = useParams();
  const { state } = useContext(AppContext);
  const { setLoading } = useOutletContext<useOutletContextProfileProps>();
  const [error, setError] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [plan, setPlan] = useState<PlanType>();
  const [step, setStep] = useState(1);
  const [formEvent, setFormEvent] = useState<EventType>(initial);
  const [eventLogo, setEventLogo] = useState<File>();
  const [fileName, setFileName] = useState("Logo");
  const [progress, setProgress] = useState<number>(0);

  const getAddress = useCallback(async () => {
    setErrorMsg("");
    setError(false);
    setLoading(true);
    if (formEvent.zipCode) {
      try {
        const address = await getAddressFromCEP(
          formEvent.zipCode.replace(/\D/g, "")
        );
        if (address) {
          setFormEvent({
            ...formEvent,
            state: address.state,
            city: address.city,
            street: address.street,
          });
        } else {
          setFormEvent({
            ...formEvent,
            state: "",
            city: "",
            street: "",
          });
        }
      } catch (err: any) {
        setErrorMsg(err.message);
        setError(true);
      }
    }
    setLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formEvent.zipCode, setLoading]);

  useEffect(() => {
    if (formEvent.zipCode && formEvent.zipCode.length === 10) getAddress();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formEvent.zipCode]);

  const handleFile = (e: React.FormEvent<HTMLInputElement>) => {
    setErrorMsg("");
    setError(false);
    const file = validateFile((e.target as HTMLInputElement).files as FileList);
    if (!file) return;
    if (typeof file === "string" && file === FILEERROR.SIZE) {
      setErrorMsg("Imagem não pode ter mais de 2 mb!");
      setError(true);
      return;
    }
    if (typeof file === "string" && file === FILEERROR.TYPE) {
      setErrorMsg("Imagem precisa ser PNG or JPG!");
      setError(true);
      return;
    }
    setFileName(file.name);
    setEventLogo(file);
    setErrorMsg("");
    setError(false);
  }

  const handleDatesChange = (value: any) => {
    const dates = value.toString().split(",");
    setFormEvent({ ...formEvent, dates });
  };

  const validadeStepOne = (f: EventType) => {
    setErrorMsg("");
    setError(false);
    if (!f.name || !f.zipCode || !f.state || !f.city) {
      setErrorMsg("Preencha os campos obrigatórios!");
      setError(true);
      return null;
    }
    if (f.email && !validateEmail(f.email)) {
      setErrorMsg("E-Mail é Obrigatório!");
      setError(true);
      return null;
    }
    if (f.zipCode.length < 10) {
      setErrorMsg("CEP Inválido!");
      setError(true);
      return null;
    }
    if (!f.dates.length) {
      setErrorMsg("Datas do Evento é obrigatório!");
      setError(true);
      return null;
    }
    return true;
  };

  const validadeStepTwo = async (f: EventType) => {
    setErrorMsg("");
    setError(false);
    if (!f.method || !f.gift || !f.prizeDraw) {
      setErrorMsg("Preencha os campos obrigatórios!");
      setError(true);
      return null;
    }
    if (f.referralCode) {
      setLoading(true);
      const upperReferralCode = f.referralCode.toLocaleUpperCase();
      setFormEvent({ ...formEvent, referralCode: upperReferralCode });
      if (!f.referral || f.referral?.code !== upperReferralCode) {
        const referral = await ReferralsAPI.getByCode(upperReferralCode);
        if (referral.referralID) {
          setFormEvent({ ...formEvent, referral });
        } else {
          setFormEvent({ ...formEvent, referralCode: "", referral: undefined });
          setErrorMsg(
            `Código de Referência - ${upperReferralCode} - Inválido!`
          );
          setError(true);
          setLoading(false);
          return null;
        }
      }
      setLoading(false);
      return true;
    } else {
      setFormEvent({ ...formEvent, referral: undefined });
    }
    return true;
  };

  const handleLogoAndMap = async (f: EventType) => {
    let mapURL = f.map || "";
    let logoURL = f.logo || "";
    const mapFile = await createMap({
      type: plan?.type === 'ADVANCED' ? PLANSTYPES.ADVANCED : PLANSTYPES.BASIC,
      id: f.eventID as string,
      name: f.name,
      street: f.street,
      number: f.number,
      city: f.city,
      state: f.state,
      zipCode: f.zipCode,
    });
    await sendPublicFile({
      type: FILETYPES.MAP,
      id: f.eventID as string,
      file: mapFile,
      setProgress,
    });
    mapURL = `/public/map/${ mapFile.name }?${Date.now()}`;
    if (eventLogo) {
      await sendPublicFile({
        type: FILETYPES.LOGO,
        id: f.eventID as string,
        file: eventLogo,
        setProgress,
      });
      logoURL = eventLogo
        ? `/public/logo/${(f.eventID as string)}.${eventLogo.name.split(".").pop()}?${Date.now()}`
        : "";
    }
    await EventsAPI.logoAndMapPatch(f.eventID as string, logoURL, mapURL);
  }


  const handleAdd = async () => {
    setErrorMsg("");
    setError(false);
    setLoading(true);
    const fomartedDates = formEvent.dates.map((d: string) =>
      DateTime.fromFormat(d, "dd/MM/yyyy").toFormat("yyyy-MM-dd")
    );
    const event = await EventsAPI.post({
      ...formEvent,
      profileID: state.profile.profileID,
      zipCode: formEvent.zipCode ? formEvent.zipCode.replace(/[^\d]/g, "") : "",
      website: formEvent.website ? normalizeWebsite(formEvent.website || "") : "",
      dates: fomartedDates,
      gift: formEvent.gift === 'YES' ? 1 : 0,
      prizeDraw: formEvent.prizeDraw === 'YES' ? 1 : 0,
      referral: formEvent.referral,
    });
    await handleLogoAndMap(event);
    setFormEvent(initial);
    navigate(ROUTES.HOME);
    setLoading(false);
    return true;
  };

  const changeStep = async (step: number, f: EventType) => {
    if (step === 1) {
      setStep(1);
      return true;
    } else if (step === 2) {
      if (validadeStepOne(f)) setStep(2);
    } else {
      if (await validadeStepTwo(f)) setStep(3);
    }
  };

  const handlePlanType = useCallback((type: PLANSTYPES) => {
    setFormEvent({
      ...formEvent,
      method: type === PLANSTYPES.BASIC ? "EMAIL" : "",
      gift: type === PLANSTYPES.BASIC ? "NO" : "",
      prizeDraw: type === PLANSTYPES.BASIC ? "NO" : "",
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getPlans = useCallback(async () => {
    const plans = await PlansAPI.get();
    const selectedPlan = plans.find(
      (p) => slugify(p.name, { lower: true }) === params.name
    );
    if (!selectedPlan) navigate(ROUTES.NEW);
    else {
      setPlan(selectedPlan);
      handlePlanType(selectedPlan.type);
    }
  }, [handlePlanType, navigate, params.name]);

  useEffect(() => {
    getPlans();
  }, [getPlans]);

  const renderStepFlow = () => {
    return (
      <ul className="flex flex-col sm:flex-row w-full gap-4 sm:gap-0 justify-evenly mx-auto mb-4">
        <li
          className={`border-b-2 px-4 ${
            step === 1
              ? "border-primary font-bold"
              : "border-slate-300 text-slate-400"
          }`}
        >
          <button type="button" onClick={() => changeStep(1, { ...formEvent })}>
            1 - Dados Gerais
          </button>
        </li>
        <li
          className={`border-b-2 px-4 ${
            step === 2
              ? "border-primary font-bold"
              : "border-slate-300 text-slate-400"
          }`}
        >
          <button type="button" onClick={() => changeStep(2, { ...formEvent })}>
            2 - Configurações
          </button>
        </li>
        <li
          className={`border-b-2 px-4 ${
            step === 3
              ? "border-primary font-bold"
              : "border-slate-300 text-slate-400"
          }`}
        >
          <button type="button" onClick={() => changeStep(3, { ...formEvent })}>
            3 - Detalhes
          </button>
        </li>
      </ul>
    );
  };

  const renderStepOne = () => {
    return (
      <div className="flex flex-wrap w-full">
        <div className="w-full md:w-4/12 sm:pr-4 mb-4">
          <Input
            type="text"
            placeholder="Nome *"
            value={formEvent.name || ""}
            handler={(e) =>
              setFormEvent({ ...formEvent, name: e.target.value })
            }
          />
        </div>
        <div className="w-full md:w-4/12 sm:pr-4 mb-4">
          <Input
            type="text"
            value={formEvent.email || ""}
            placeholder="Email"
            handler={(e) =>
              setFormEvent({ ...formEvent, email: e.target.value })
            }
          />
        </div>
        <div className="w-full md:w-4/12 mb-4">
          <Input
            type="text"
            value={formEvent.website || ""}
            placeholder="WebSite"
            handler={(e) =>
              setFormEvent({ ...formEvent, website: e.target.value })
            }
          />
        </div>
        <div className="w-full md:w-4/12 sm:pr-4 mb-4">
          <Input
            type="text"
            value={formEvent.zipCode || ""}
            placeholder="CEP *"
            handler={(e) =>
              setFormEvent({
                ...formEvent,
                zipCode: normalizeCEP(e.target.value),
              })
            }
          />
        </div>
        <div className="w-full md:w-4/12 sm:pr-4 mb-4">
          <Select
            placeholder="Estado"
            value={formEvent.state || ""}
            handler={(e) =>
              setFormEvent({ ...formEvent, state: e.target.value })
            }
          >
            <>
              <option value="">Estado *</option>
              {BrazilStates.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.name}
                </option>
              ))}
            </>
          </Select>
        </div>
        <div className="w-full md:w-4/12 mb-4">
          <Input
            type="text"
            value={formEvent.city || ""}
            placeholder="Cidade *"
            handler={(e) =>
              setFormEvent({ ...formEvent, city: e.target.value })
            }
          />
        </div>
        <div className="w-full md:w-4/12 sm:pr-4 mb-4">
          <Input
            type="text"
            value={formEvent.district || ""}
            placeholder="Bairro"
            handler={(e) =>
              setFormEvent({ ...formEvent, district: e.target.value })
            }
          />
        </div>
        <div className="w-full md:w-4/12 sm:pr-4 mb-4">
          <Input
            type="text"
            value={formEvent.street || ""}
            placeholder="Rua"
            handler={(e) =>
              setFormEvent({ ...formEvent, street: e.target.value })
            }
          />
        </div>
        <div className="w-full md:w-4/12 mb-4">
          <Input
            type="text"
            value={formEvent.number || ""}
            placeholder="Número"
            handler={(e) =>
              setFormEvent({ ...formEvent, number: e.target.value })
            }
          />
        </div>
        <div className="w-full md:w-4/12 sm:pr-4 mb-4">
          <Input
            type="text"
            value={formEvent.complement || ""}
            placeholder="Complemento"
            handler={(e) =>
              setFormEvent({ ...formEvent, complement: e.target.value })
            }
          />
        </div>
        <div className="w-full md:w-8/12 mb-4">
          <DatePicker
            onChange={handleDatesChange}
            value={formEvent.dates}
            format="DD/MM/YYYY"
            multiple
            weekDays={["D", "S", "T", "Q", "Q", "S", "S"]}
            months={[
              "Janeiro",
              "Fevereiro",
              "Março",
              "Abril",
              "Maio",
              "Junho",
              "Julho",
              "Agosto",
              "Setembro",
              "Outubro",
              "Novembro",
              "Dezembro",
            ]}
            minDate={new Date()}
            style={{
              height: "40px",
            }}
            placeholder="Datas do Evento *"
          />
        </div>
      </div>
    );
  };

  const renderStepTwo = () => {
    return (
      <div className="flex flex-wrap w-full">
        <div className="w-full md:w-6/12 sm:pr-4 mb-4">
          <Select
            value={formEvent.method || ""}
            handler={(e) =>
              setFormEvent({ ...formEvent, method: e.target.value })
            }
            disabled={plan?.type.toLocaleLowerCase() === "basic"}
            placeholder="Método"
          >
            <>
              <option value="">Método *</option>
              <option value="SMS">Metódo: SMS *</option>
              <option value="EMAIL">Metódo: EMAIL</option>
            </>
          </Select>
          <small>{formEvent.method === "SMS" && "* R$ 0,16 por SMS"}</small>
        </div>
        <div className="w-full md:w-6/12 mb-4">
          <Select
            value={formEvent.gift || ""}
            handler={(e) =>
              setFormEvent({ ...formEvent, gift: e.target.value })
            }
            disabled={plan?.type.toLocaleLowerCase() === "basic"}
            placeholder="Brinde?*"
          >
            <>
              <option value="">Brinde *</option>
              <option value="YES">Brinde: Sim</option>
              <option value="NO">Brinde: Não</option>
            </>
          </Select>
        </div>
        <div className="w-full md:w-6/12 sm:pr-4 mb-4">
          <Select
            value={formEvent.prizeDraw || ""}
            handler={(e) =>
              setFormEvent({ ...formEvent, prizeDraw: e.target.value })
            }
            disabled={plan?.type.toLocaleLowerCase() === "basic"}
            placeholder="Sorteio Final?*"
          >
            <>
              <option value="">Sorteio Final? *</option>
              <option value="YES">Sorteio Final: Sim</option>
              <option value="NO">Sorteio Final: Não</option>
            </>
          </Select>
        </div>
        <div className="w-full md:w-6/12 mb-4">
          <Input
            value={formEvent.referralCode || ""}
            handler={(e) =>
              setFormEvent({ ...formEvent, referralCode: e.target.value })
            }
            type="text"
            placeholder="Código de Referência"
          />
          <small>
            {formEvent.referral &&
              `Referência: ${formEvent.referral?.company} / ${formEvent.referral?.contact}`}
          </small>
        </div>
      </div>
    );
  };

  const renderStepThree = () => {
    return (
      <div className="flex flex-wrap w-full">
        <div className="w-full mb-4">
          <InputFile fileName={fileName} handler={(e) => handleFile(e)} />
        </div>
        {formEvent.gift === "YES" && (
          <div
            className={`w-full ${
              formEvent.prizeDraw === "YES" && "md:w-6/12"
            } sm:pr-4  mb-4`}
          >
            <h4 className="text-center mb-2">
              Breve descrição do <strong>Brinde</strong>
            </h4>
            <MDEditor
              value={formEvent.giftDescription}
              onChange={(text) =>
                setFormEvent({ ...formEvent, giftDescription: text })
              }
              previewOptions={{
                rehypePlugins: [[rehypeSanitize]],
              }}
            />
          </div>
        )}
        {formEvent.prizeDraw === "YES" && (
          <div
            className={`w-full ${
              formEvent.gift === "YES" && "md:w-6/12"
            } sm:pr-4  mb-4`}
          >
            <h4 className="text-center mb-2">
              Breve descrição do <strong>Sorteio Final</strong>
            </h4>
            <MDEditor
              value={formEvent.prizeDrawDescription}
              onChange={(text) =>
                setFormEvent({ ...formEvent, prizeDrawDescription: text })
              }
              previewOptions={{
                rehypePlugins: [[rehypeSanitize]],
              }}
            />
          </div>
        )}
        <div className="w-full mb-4">
          <h4 className="text-center mb-2">
            Breve descrição do <strong>Evento</strong>
          </h4>
          <MDEditor
            value={formEvent.description}
            onChange={(text) =>
              setFormEvent({ ...formEvent, description: text })
            }
            previewOptions={{
              rehypePlugins: [[rehypeSanitize]],
            }}
          />
        </div>
      </div>
    );
  };

  return (
    <>
      {!!progress && <Uploading progress={progress} />}
      <Title
        text={`Novo Evento - ${plan?.name}`}
        back={ROUTES.NEW}
        className="font-bold text-center"
      />
      {error && <Alert type={ALERT.ERROR} text={errorMsg} />}
      <Form>
        {renderStepFlow()}
        {step === 1 && renderStepOne()}
        {step === 2 && renderStepTwo()}
        {step === 3 && renderStepThree()}
        <div className="w-full flex justify-center">
          <button
            type="button"
            onClick={() =>
              step < 3 ? changeStep(step + 1, { ...formEvent }) : handleAdd()
            }
            className={`${
              step < 3 ? "bg-secondary" : "bg-primary"
            } px-4 py-1.5 text-sm text-white font-semibold uppercase rounded shadow-md cursor-pointer hover:bg-secondary hover:shadow-md focus:bg-secondary focus:shadow-md focus:outline-none focus:ring-0 active:bg-secondary active:shadow-md transition duration-150 ease-in-out`}
          >
            {step < 3 ? "Continuar" : "Adicionar Novo Evento"}
          </button>
        </div>
      </Form>
    </>
  );
}
