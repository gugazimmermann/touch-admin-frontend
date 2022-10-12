import { ReactElement } from "react";
import { Input, Select } from "../../components";
import { SURVEYANSWER } from "../../interfaces/enums";
import { SurveyQuestionType } from "../../interfaces/types";

type SurveysQuestionFormProps = {
  question: SurveyQuestionType;
  setQuestion: (question: SurveyQuestionType) => void;
};

export default function SurveysQuestionForm({
  question,
  setQuestion,
}: SurveysQuestionFormProps): ReactElement {
  const translateSurveyType = (type: string) => {
    if (type === SURVEYANSWER.SINGLE) return "Escolha Simples";
    if (type === SURVEYANSWER.MULTIPLE) return "Múltiplas Escolhas";
    if (type === SURVEYANSWER.TEXT) return "Texto";
    if (type === SURVEYANSWER.MULTILINE) return "Texto Várias Linhas";
  };

  return (
    <>
      {(question.type) && (
        <div className="w-full mb-2">
          {(question.type === SURVEYANSWER.TEXT || question.type === SURVEYANSWER.MULTILINE) && (
            <small>Respostas em texto não aparecem nos gráficos!</small>
          )}
          {question.type === SURVEYANSWER.SINGLE && (
            <small>Visitante poderá escolher somente uma das opções!</small>
          )}
          {question.type === SURVEYANSWER.MULTIPLE && (
            <small>Visitante poderá escolher várias opções!</small>
          )}
        </div>
      )}
      <div className="w-full sm:w-3/12 sm:pr-4 mb-4">
        <Select
          value={question.type}
          handler={(e) => setQuestion({ ...question, type: e.target.value as SURVEYANSWER })}
          placeholder="Tipo *"
        >
          <>
            <option value="">Tipo *</option>
            {Object.keys(SURVEYANSWER).map((t) => (
              <option key={t} value={t}>
                {translateSurveyType(t)}
              </option>
            ))}
          </>
        </Select>
      </div>
      <div className="w-full sm:w-3/12 sm:pr-4 mb-4">
        <Select
          value={question.required}
          handler={(e) => setQuestion({ ...question, required: e.target.value })}
          placeholder="Obrigatória?"
        >
          <>
            <option value="">Obrigatória?</option>
            <option value="Não">Não</option>
            <option value="Sim">Sim</option>
          </>
        </Select>
      </div>
      <div className="w-full sm:w-6/12 mb-4">
        <Input
          value={question.text}
          handler={(e) => setQuestion({ ...question, text: e.target.value })}
          type="text"
          placeholder="Pergunta"
        />
      </div>
    </>
  );
}
