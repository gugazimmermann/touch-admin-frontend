import { ReactElement, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { Input } from "../../components";
import { SurveyQuestionType, SurveyType } from "../../interfaces/types";
import DroppableList from './components/DroppableList';

type SurveysAnswerFormProps = {
  survey: SurveyType;
  setSurvey: (survey: SurveyType) => void;
  question: SurveyQuestionType;
  setQuestion: (question: SurveyQuestionType) => void;
};

export default function SurveysAnswerForm({
  survey,
  setSurvey,
  question,
  setQuestion,
}: SurveysAnswerFormProps): ReactElement {
  const [answersText, setAnswersText] = useState<string>("");

  function handleAddAnswer() {
    const cloneAnswers = question.answers.map((x) => x);
    cloneAnswers.push({
      id: uuidv4(),
      text: answersText,
      order: cloneAnswers.length + 1,
    });
    setQuestion({...question, answers: cloneAnswers});
    setAnswersText("");
  }

  const saveAnswerDisabled = (): boolean => !answersText;

  return (
    <>
      <div className="w-10/12 pr-4 mb-4">
        <Input
          value={answersText}
          type="text"
          placeholder="Resposta"
          handler={(e) => setAnswersText(e.target.value)}
        />
      </div>
      <div className="flex items-center w-2/12 mb-4">
        <button
          type="button"
          onClick={() => handleAddAnswer()}
          disabled={saveAnswerDisabled()}
          className={`flex items-center justify-center w-full h-full px-2 py-1 text-xs text-white font-semibold uppercase rounded shadow-md cursor-pointer ${
            saveAnswerDisabled() ? "bg-gray-500" : "bg-warning"
          }`}
        >
          <i className="bx bx-plus-circle text-xl sm:mr-2" />
          <span className="hidden sm:flex">Adicionar</span>
        </button>
      </div>
      {!!question.answers.length && (
        <DroppableList
          type="answers"
          droppableID={uuidv4()}
          survey={survey}
          setSurvey={setSurvey}
          question={question}
          setQuestion={setQuestion}
        />
      )}
    </>
  );
}
