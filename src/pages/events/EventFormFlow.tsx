import { PLANSTYPES } from "../../interfaces/enums";

type EventFormFlowProps = {
  step: number;
  changeStep: (step: number) => void;
  type: PLANSTYPES;
}

const EventFormFlow = ({step, changeStep, type}: EventFormFlowProps) => {
  return (
    <ul className="flex flex-col sm:flex-row w-full gap-4 sm:gap-0 justify-evenly mx-auto mb-4">
      <li
        className={`border-b-2 px-4 ${
          step === 1
            ? "border-primary font-bold"
            : "border-slate-300 text-slate-400"
        }`}
      >
        <button type="button" onClick={() => changeStep(1)}>
          Dados Gerais
        </button>
      </li>
      {type === PLANSTYPES.ADVANCED && (
        <li
          className={`border-b-2 px-4 ${
            step === 2
              ? "border-primary font-bold"
              : "border-slate-300 text-slate-400"
          }`}
        >
          <button
            type="button"
            onClick={() => changeStep(2)}
          >
            Configurações
          </button>
        </li>
      )}
      <li
        className={`border-b-2 px-4 ${
          step === 3
            ? "border-primary font-bold"
            : "border-slate-300 text-slate-400"
        }`}
      >
        <button type="button" onClick={() => changeStep(3)}>
          Detalhes
        </button>
      </li>
      <li
        className={`border-b-2 px-4 ${
          step === 4
            ? "border-primary font-bold"
            : "border-slate-300 text-slate-400"
        }`}
      >
        <button type="button" onClick={() => changeStep(4)}>
          Pagamento
        </button>
      </li>
    </ul>
  );
}

export default EventFormFlow;
