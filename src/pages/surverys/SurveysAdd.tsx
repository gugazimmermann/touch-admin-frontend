import { useState, useEffect, useCallback, ReactElement } from "react";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import EventsAPI from "../../api/events";
import { LANGUAGES, ROUTES, SURVEYANSWER } from "../../interfaces/enums";
import {
  EventType,
  SurveyQuestionType,
  SurveyType,
  useOutletContextProfileProps,
  UUID,
} from "../../interfaces/types";
import { Form } from "../../components";
import DroppableList from "./components/DroppableList";
import SurveysTitle from "./components/SurveysTitle";
import SurveysQuestionForm from "./SurveysQuestionForm";
import SurveysAnswerForm from "./SurveysAnswerForm";
import SurveysAPI from "../../api/surveys";

const initialSurvey: SurveyType = {
  surveyID: uuidv4(),
  profileID: "",
  eventID: "",
  language: LANGUAGES.BR,
  questions: [],
};

const initialQuestion: SurveyQuestionType = {
  id: uuidv4(),
  order: 1,
  text: "",
  type: "" as SURVEYANSWER,
  required: "",
  answers: [],
};

export default function SurveysAdd() {
  const params = useParams();
  const navigate = useNavigate();
  const { setLoading } = useOutletContext<useOutletContextProfileProps>();
  const [event, setEvent] = useState<EventType>();
  const [survey, setSurvey] = useState<SurveyType>(initialSurvey);
  const [question, setQuestion] = useState<SurveyQuestionType>(initialQuestion);

  const resetSurvey = (): void =>
    setSurvey({ ...initialSurvey, surveyID: uuidv4() });
  const resetQuestion = (): void =>
    setQuestion({ ...initialQuestion, id: uuidv4() });

  const handleSaveSurvey = async () => {
    setLoading(true);
    await SurveysAPI.post({
      surveyID: survey.surveyID,
      eventID: event?.eventID as string,
      profileID: event?.profileID as string,
      surveys: [{
        language: survey.language,
        questions: survey.questions
      }]
    });
    resetSurvey();
    resetQuestion();
    setLoading(false);
    navigate(`${ROUTES.EVENTS}/${event?.eventID}`);
  };

  const handleSaveQuestion = () => {
    const cloneQuestions = survey.questions.map((x) => x);
    cloneQuestions.push(question);
    setSurvey({ ...survey, questions: cloneQuestions });
    setQuestion({ ...initialQuestion, id: uuidv4() });
  };

  const saveQuestionDisabled = (): boolean => {
    if (!question.type || !question.text) return true;
    if (
      (question.type === SURVEYANSWER.SINGLE ||
        question.type === SURVEYANSWER.MULTIPLE) &&
      !question.answers.length
    )
      return true;
    return false;
  };

  const handleGetEvent = useCallback(
    async (eventID: UUID) => {
      setLoading(true);
      const data = await EventsAPI.getByEnvetID(eventID);
      if (data) {
        setEvent(data);
        setLoading(false);
      } else {
        navigate(ROUTES.HOME);
      }
    },
    [navigate, setLoading]
  );

  useEffect(() => {
    if (params.eventID) handleGetEvent(params.eventID);
  }, [handleGetEvent, params.eventID]);

  function renderAnswerButtons() {
    return (
      <div className="w-full flex justify-evenly">
        {!!question.answers.length && (
          <button
            type="button"
            onClick={() => setQuestion({ ...initialQuestion, id: uuidv4() })}
            className="flex items-center bg-slate-500 px-2 py-1 pr-4 text-sm text-white font-semibold uppercase rounded shadow-md cursor-pointer"
          >
            <i className="bx bx-left-arrow-alt text-xl mr-2" />
            Cancelar Pergunda
          </button>
        )}
        <button
          type="button"
          onClick={() => handleSaveQuestion()}
          disabled={saveQuestionDisabled()}
          className={`flex items-center px-2 py-1 pr-4 text-sm text-white font-semibold uppercase rounded shadow-md cursor-pointer ${
            saveQuestionDisabled()
              ? "bg-gray-500"
              : "bg-primary hover:bg-secondary"
          }`}
        >
          <i className="bx bx-down-arrow-alt text-xl mr-2" />
          Guardar Pergunta
        </button>
      </div>
    );
  }

  const renderQuestionButtons = (): ReactElement => (
    <div className="w-full flex justify-evenly">
      <button
        type="button"
        onClick={() => resetSurvey()}
        className="flex items-center bg-danger px-2 py-1 pr-4 text-sm text-white font-semibold uppercase rounded shadow-md cursor-pointer"
      >
        <i className="bx bx-x-circle text-xl mr-2" />
        Cancelar Pesquisa
      </button>
      <button
        type="button"
        onClick={() => handleSaveSurvey()}
        className="flex items-center bg-primary px-2 py-1 pr-4 text-sm text-white font-semibold uppercase rounded shadow-md cursor-pointer hover:bg-secondary hover:shadow-md focus:bg-secondary focus:shadow-md focus:outline-none focus:ring-0 active:bg-secondary active:shadow-md transition duration-150 ease-in-out"
      >
        <i className="bx bx-save text-xl mr-2" />
        Salvar pesquisa
      </button>
    </div>
  );

  return (
    <>
      <SurveysTitle event={event} />
        <Form>
          <SurveysQuestionForm question={question} setQuestion={setQuestion} />
          {(question?.type === SURVEYANSWER.SINGLE ||
            question?.type === SURVEYANSWER.MULTIPLE) && (
            <SurveysAnswerForm
              survey={survey}
              setSurvey={setSurvey}
              question={question}
              setQuestion={setQuestion}
            />
          )}
          {renderAnswerButtons()}
        </Form>
      {!!survey.questions.length && (
        <Form>
          <DroppableList
            type="questions"
            droppableID={uuidv4()}
            survey={survey}
            setSurvey={setSurvey}
            question={question}
            setQuestion={setQuestion}
          />
          {renderQuestionButtons()}
        </Form>
      )}
    </>
  );
}
