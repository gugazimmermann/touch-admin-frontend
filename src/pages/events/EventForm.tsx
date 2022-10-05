import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { DateTime } from "luxon";
import { ROUTES, PLANSTYPES, ALERT, BrazilStates, FILEERROR } from '../../interfaces/enums';
import { getAddressFromCEP, normalizeCEP, validateEmail, validateFile } from "../../helpers";
import DatePicker from "react-multi-date-picker";
import { Form, Input, Select, InputFile, Uploading, Title, Alert } from "../../components";
import { PlanType } from "../../interfaces/types";

const initial = {
  name: "",
  website: "",
  email: "",
  zipCode: "",
  state: "",
  city: "",
  district: "",
  street: "",
  number: "",
  complement: "",
  referralCode: "",
  dates: [],
  method: "",
  gift: "",
  giftDescription: "",
  prizeDraw: "",
  prizeDrawDescription: "",
};

type EventFormProps = {
  plan: PlanType;
};

export default function EventForm({ plan }: EventFormProps) {
  const navigate = useNavigate();
  const params = useParams();
  const [error, setError] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [formEvent, setFormEvent] = useState(initial);
  const [eventLogo, setEventLogo] = useState<File>();
  const [fileName, setFileName] = useState('Logo');
  const [progress, setProgress] = useState();

  const getAddress = useCallback(async () => {
    setErrorMsg("");
    setError(false);
    setLoading(true);
    try {
      const address = await getAddressFromCEP(formEvent.zipCode.replace(/\D/g, ""));
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
    setLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formEvent.zipCode, setLoading]);

  useEffect(() => {
    if (formEvent.zipCode.length === 10) getAddress();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formEvent.zipCode]);

  function handleFile(e: React.FormEvent<HTMLInputElement>) {
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

  function handleDatesChange(value: any) {
    const dates = value.toString().split(",");
    const fomartedDates = dates.map((d: string) =>
    DateTime.fromFormat(d, "DD-MM-YYYY").toFormat("YYYY-MM-DD")
    );
    setFormEvent({ ...formEvent, dates: fomartedDates });
  }

  function changeStep() {
  	setErrorMsg('');
  	setError(false);
  	setLoading(true);
  	if (!formEvent.name || !formEvent.zipCode || !formEvent.state || !formEvent.city) {
  		setErrorMsg('Preencha os campos obrigatórios!');
  		setError(true);
  		setLoading(false);
  		return null;
  	}
  	if (formEvent.email && !validateEmail(formEvent.email)) {
  		setErrorMsg('E-Mail é Obrigatório!');
  		setError(true);
  		setLoading(false);
  		return null;
  	}
  	if (formEvent.zipCode.length < 10) {
  		setErrorMsg('CEP Inválido!');
  		setError(true);
  		setLoading(false);
  		return null;
  	}
  	setLoading(false);
  	setStep(2);
  	return true;
  }

  async function handleAdd() {
  	setErrorMsg('');
  	setError(false);
  	setLoading(true);
  	setFormEvent(initial);
  	setLoading(false);
  	return true;
  }

  useEffect(() => {
    const handleEventType = (type: PLANSTYPES) => {
      setFormEvent({
        ...formEvent,
        method: type === PLANSTYPES.BASIC ? "EMAIL" : "",
        gift: type === PLANSTYPES.BASIC ? "NO" : "",
        prizeDraw: type === PLANSTYPES.BASIC ? "NO" : "",
      });
    };
    if (!plan) navigate(ROUTES.HOME);
    else handleEventType(plan.type);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate, plan]);

  function renderStepFlow() {
    return (
      <ul className="flex flex-col sm:flex-row w-full gap-4 sm:gap-0 justify-evenly mx-auto mb-4">
        <li
          className={`border-b-2 px-4 ${
            step === 1
              ? "border-primary font-bold"
              : "border-slate-300 text-slate-400"
          }`}
        >
          <button type="button" onClick={() => setStep(1)}>
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
          <button type="button" onClick={() => setStep(2)}>
            2 - Detalhes do Evento
          </button>
        </li>
      </ul>
    );
  }

  function renderStepOne() {
    return (
      <div className="flex flex-wrap w-full">
        <div className="w-full md:w-4/12 sm:pr-4 mb-4">
          <Input
            type="text"
            placeholder="Nome *"
            value={formEvent.name || ""}
            handler={(e) => setFormEvent({ ...formEvent, name: e.target.value })}
          />
        </div>
        <div className="w-full md:w-4/12 sm:pr-4 mb-4">
          <Input
            type="text"
            value={formEvent.email || ""}
            placeholder="Email"
            disabled
          />
        </div>
        <div className="w-full md:w-4/12 mb-4">
          <Input
            type="text"
            value={formEvent.website || ""}
            placeholder="WebSite"
            handler={(e) => setFormEvent({ ...formEvent, website: e.target.value })}
          />
        </div>
        <div className="w-full md:w-4/12 sm:pr-4 mb-4">
          <Input
            type="text"
            value={formEvent.zipCode || ""}
            placeholder="CEP *"
            handler={(e) => setFormEvent({ ...formEvent, zipCode: normalizeCEP(e.target.value) })
            }
          />
        </div>
        <div className="w-full md:w-4/12 sm:pr-4 mb-4">
          <Select
            placeholder="Estado"
            value={formEvent.state || ""}
            handler={(e) => setFormEvent({ ...formEvent, state: e.target.value })}
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
            handler={(e) => setFormEvent({ ...formEvent, city: e.target.value })}
          />
        </div>
        <div className="w-full md:w-4/12 sm:pr-4 mb-4">
          <Input
            type="text"
            value={formEvent.district || ""}
            placeholder="Bairro"
            handler={(e) => setFormEvent({ ...formEvent, district: e.target.value })}
          />
        </div>
        <div className="w-full md:w-4/12 sm:pr-4 mb-4">
          <Input
            type="text"
            value={formEvent.street || ""}
            placeholder="Rua"
            handler={(e) => setFormEvent({ ...formEvent, street: e.target.value })}
          />
        </div>
        <div className="w-full md:w-4/12 mb-4">
          <Input
            type="text"
            value={formEvent.number || ""}
            placeholder="Número"
            handler={(e) => setFormEvent({ ...formEvent, number: e.target.value })}
          />
        </div>
        <div className="w-full md:w-4/12 sm:pr-4 mb-4">
          <Input
            type="text"
            value={formEvent.complement || ""}
            placeholder="Complemento"
            handler={(e) => setFormEvent({ ...formEvent, complement: e.target.value })}
          />
        </div>
        <div className="w-full md:w-8/12 mb-4">
          <DatePicker
            onChange={handleDatesChange}
            format="DD/MM/YYYY"
            multiple
            weekDays={['D', 'S', 'T', 'Q', 'Q', 'S', 'S']}
            months={[
              'Janeiro',
              'Fevereiro',
              'Março',
              'Abril',
              'Maio',
              'Junho',
              'Julho',
              'Agosto',
              'Setembro',
              'Outubro',
              'Novembro',
              'Dezembro',
            ]}
            minDate={new Date()}
            style={{
              height: "40px",
            }}
            placeholder="Datas do Evento"
          />
        </div>
      </div>
    );
  }

  function renderStepTwo() {
    return (
      <div className="flex flex-wrap w-full">
        <div className="w-full md:w-6/12 sm:pr-4 mb-4">
        <InputFile fileName={fileName} handler={(e) => handleFile(e)} />
        </div>
        <div className="w-full md:w-6/12 mb-4">
          <Select
            value={formEvent.method || ""}
            handler={(e) =>
              setFormEvent({ ...formEvent, method: e.target.value })
            }
            disabled={plan.type.toLocaleLowerCase() === "basic"}
            placeholder='Método'
          >
            <>
              <option value="">Método *</option>
              <option value="SMS">SMS</option>
              <option value="EMAIL">EMAIL</option>
            </>
          </Select>
        </div>
        <div className="w-full md:w-6/12 sm:pr-4 mb-4">
          <Select
            value={formEvent.gift || ""}
            handler={(e) =>
              setFormEvent({ ...formEvent, gift: e.target.value })
            }
            disabled={plan.type.toLocaleLowerCase() === "basic"}
            placeholder='Brinde?*'
          >
            <>
              <option value="">Brinde *</option>
              <option value="YES">Sim</option>
              <option value="NO">Não</option>
            </>
          </Select>
        </div>
        <div className="w-full md:w-6/12 mb-4">
          <Select
            value={formEvent.prizeDraw || ""}
            handler={(e) =>
              setFormEvent({ ...formEvent, prizeDraw: e.target.value })
            }
            disabled={plan.type.toLocaleLowerCase() === "basic"}
            placeholder="Sorteio Final?*"
          >
            <>
              <option value="">Sorteio Final?*</option>
              <option value="YES">Sim</option>
              <option value="NO">Não</option>
            </>
          </Select>
        </div>
        <div className="w-full md:w-6/12 sm:pr-4 mb-4">
          <Input
            value={formEvent.referralCode || ""}
            handler={(e) =>
              setFormEvent({ ...formEvent, referralCode: e.target.value })
            }
            type="text"
            placeholder="Código de Referência"
          />
        </div>
      </div>
    );
  }

  return (
    <>
      {!!progress && <Uploading progress={progress} />}
      <Title
        text='Novo Evento'
        back={ROUTES.NEW}
        className="font-bold text-center"
      />
      {error && <Alert type={ALERT.ERROR} text={errorMsg} />}
      <Form>
        {renderStepFlow()}
        {step === 1 && renderStepOne()}
        {step === 2 && renderStepTwo()}
        <div className="w-full flex justify-center">
					<button
						type="button"
						onClick={() => (step === 1 ? changeStep() : handleAdd())}
						className="bg-primary px-4 py-1.5 text-sm text-white font-semibold uppercase rounded shadow-md cursor-pointer hover:bg-secondary hover:shadow-md focus:bg-secondary focus:shadow-md focus:outline-none focus:ring-0 active:bg-secondary active:shadow-md transition duration-150 ease-in-out"
					>
						{step === 1 ? 'Continuar' : 'Adicionar Novo Evento'}
					</button>
				</div>
      </Form>
    </>
  );
}
