import { useCallback, useContext, useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { DateTime } from "luxon";
import {
  ROUTES,
  PLANSTYPES,
  ALERT,
  FILEERROR,
  FILETYPES,
} from "../../interfaces/enums";
import {
  createMap,
  getAddressFromCEP,
  normalizeWebsite,
  validateEmail,
  validateFile,
} from "../../helpers";
import {
  Form,
  Uploading,
  Title,
  Alert,
  LoadingSmall,
  Loading,
} from "../../components";
import { EventType, PlanType } from '../../interfaces/types';
import PlansAPI from "../../api/plans";
import slugify from "slugify";
import ReferralsAPI from "../../api/referral";
import EventsAPI from "../../api/events";
import { AppContext } from "../../context";
import { sendPublicFile } from "../../api/storage";
import EventFormFlow from "./EventFormFlow";
import EventsFormStepOne from "./EventsFormStepOne";
import EventFormStepTwo from "./EventFormStepTwo";
import EventFormStepThree from "./EventFormStepThree";

const initial: EventType = {
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
  const location = useLocation();
  const { state } = useContext(AppContext);
  const [loading, setLoading] = useState(false);
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
  };

  const validadeReferralCode = async () => {
    const referralCode = (formEvent?.referralCode || "").toLocaleUpperCase();
    setFormEvent({ ...formEvent, referralCode });
    if (
      !formEvent.referral ||
      (formEvent.referral && formEvent.referral.code !== referralCode)
    ) {
      const referral = await ReferralsAPI.getByCode(referralCode);
      if (referral.referralID) {
        setFormEvent({ ...formEvent, referral });
      } else {
        setFormEvent({ ...formEvent, referralCode: "", referral: undefined });
        setErrorMsg(`Código de Referência - ${referralCode} - Inválido!`);
        setError(true);
        setLoading(false);
        return null;
      }
    }
    return true;
  };

  const validadeStepOne = () => {
    setErrorMsg("");
    setError(false);
    if (
      !formEvent.name ||
      !formEvent.zipCode ||
      !formEvent.state ||
      !formEvent.city
    ) {
      setErrorMsg("Preencha os campos obrigatórios!");
      setError(true);
      return null;
    }
    if (formEvent.email && !validateEmail(formEvent.email)) {
      setErrorMsg("E-Mail é Obrigatório!");
      setError(true);
      return null;
    }
    if (formEvent.zipCode.length < 10) {
      setErrorMsg("CEP Inválido!");
      setError(true);
      return null;
    }
    if (plan?.type !== PLANSTYPES.SUBSCRIPTION && !formEvent.dates.length) {
      setErrorMsg("Datas do Evento é obrigatório!");
      setError(true);
      return null;
    }
    return true;
  };

  const validadeStepTwo = async () => {
    setErrorMsg("");
    setError(false);
    if (!formEvent.method || !formEvent.gift || !formEvent.prizeDraw) {
      setErrorMsg("Preencha os campos obrigatórios!");
      setError(true);
      return null;
    }
    if (formEvent.referralCode) {
      await validadeReferralCode();
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
      type: plan?.type === "ADVANCED" ? PLANSTYPES.ADVANCED : PLANSTYPES.BASIC,
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
    mapURL = `/public/map/${mapFile.name}?${Date.now()}`;
    if (eventLogo) {
      await sendPublicFile({
        type: FILETYPES.LOGO,
        id: f.eventID as string,
        file: eventLogo,
        setProgress,
      });
      logoURL = eventLogo
        ? `/public/logo/${f.eventID as string}.${eventLogo.name
            .split(".")
            .pop()}?${Date.now()}`
        : "";
    }
    await EventsAPI.logoAndMapPatch(f.eventID as string, logoURL, mapURL);
  };

  const handleSaveEvent = async (): Promise<EventType> => {
    const fomartedDates = formEvent.dates.map((d: string) =>
      DateTime.fromFormat(d, "dd/MM/yyyy").toFormat("yyyy-MM-dd")
    );
    return await EventsAPI.post({
      ...formEvent,
      profileID: state.profile.profileID,
      planType: plan?.type,
      plan: plan,
      "profileID#PlanType": `${state.profile.profileID}#${plan?.type}`,
      zipCode: formEvent.zipCode ? formEvent.zipCode.replace(/[^\d]/g, "") : "",
      website: formEvent.website
        ? normalizeWebsite(formEvent.website || "")
        : "",
      dates: fomartedDates,
      gift: formEvent.gift === "Não" ? 0 : 1,
      prizeDraw: formEvent.prizeDraw === "Não" ? 0 : 1,
      referral: formEvent.referral,
    });
  };

  const handleAdd = async () => {
    setErrorMsg("");
    setError(false);
    setLoading(true);
    if (plan?.type !== PLANSTYPES.ADVANCED) {
      if (formEvent.referralCode && !(await validadeReferralCode())) return;
    }
    const event = await handleSaveEvent();
    await handleLogoAndMap(event);
    setFormEvent(initial);
    setLoading(false);
    navigate(`${ROUTES.EVENTS}/${event.eventID}`);
    return true;
  };

  const changeStep = async (step: number) => {
    if (plan?.type === PLANSTYPES.ADVANCED) {
      if (step === 2) if (!validadeStepOne()) return;
      if (step === 3) if (!(await validadeStepTwo())) return;
    } else {
      if (step === 3) if (!validadeStepOne()) return;
    }
    setStep(step);
  };

  const handlePlanType = useCallback((type: PLANSTYPES) => {
    setFormEvent({
      ...formEvent,
      method: type !== PLANSTYPES.ADVANCED ? "EMAIL" : "",
      gift: type !== PLANSTYPES.ADVANCED ? "Não" : "",
      prizeDraw: type !== PLANSTYPES.ADVANCED ? "Não" : "",
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getPlans = useCallback(async () => {
    setLoading(true);
    const plans = await PlansAPI.get();
    const selectedPlan = plans.find(
      (p) => slugify(p.name, { lower: true }) === params.name
    );
    if (!selectedPlan) {
      setLoading(false);
      navigate(ROUTES.NEW);
    } else {
      setPlan(selectedPlan);
      handlePlanType(selectedPlan.type);
      setLoading(false);
    }
  }, [handlePlanType, navigate, params.name, setLoading]);

  useEffect(() => {
    if (!location.state.plan) getPlans();
    else {
      setPlan(location.state.plan);
      handlePlanType(location.state.plan.type);
    }
  }, [getPlans, handlePlanType, location.state.plan]);

  if (!plan) return <LoadingSmall />;
  return (
    <>
      {loading && <Loading />}
      {!!progress && <Uploading progress={progress} />}
      <Title
        text={
          plan.type === PLANSTYPES.SUBSCRIPTION
            ? "Nova Assinatura"
            : `Novo Evento - ${plan?.name}`
        }
        back={ROUTES.NEW}
        className="font-bold text-center"
      />
      {error && <Alert type={ALERT.ERROR} text={errorMsg} />}
      <Form>
        <EventFormFlow
          step={step}
          changeStep={changeStep}
          type={plan.type as PLANSTYPES}
        />
        {step === 1 && (
          <EventsFormStepOne
            formEvent={formEvent}
            setFormEvent={setFormEvent}
            type={plan.type}
          />
        )}
        {step === 2 && plan.type === PLANSTYPES.ADVANCED && (
          <EventFormStepTwo
            formEvent={formEvent}
            setFormEvent={setFormEvent}
            type={plan.type}
          />
        )}
        {step === 3 && (
          <EventFormStepThree
            formEvent={formEvent}
            setFormEvent={setFormEvent}
            type={plan.type}
            fileName={fileName}
            handleFile={handleFile}
          />
        )}
        <div className="w-full flex justify-center">
          <button
            type="button"
            onClick={() => {
              if (step === 3) handleAdd();
              else {
                if (plan.type === PLANSTYPES.ADVANCED) changeStep(step + 1);
                else {
                  if (step === 1) changeStep(3);
                  else changeStep(3);
                }
              }
            }}
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
