import { useState, useCallback, useEffect } from "react";
import { useParams, useNavigate, useOutletContext } from "react-router-dom";
import { Predictions } from "aws-amplify";
import EventsAPI from "../../api/events";
import SurveysAPI from "../../api/surveys";
import { LANGUAGES, LANGUAGESLABELS, ROUTES } from "../../interfaces/enums";
import {
  useOutletContextProfileProps,
  UUID,
  EventType,
  SurveyType,
  SurveyQuestionType,
} from "../../interfaces/types";

export default function SurveysEdit() {
  const params = useParams();
  const navigate = useNavigate();
  const { setLoading } = useOutletContext<useOutletContextProfileProps>();
  const [event, setEvent] = useState<EventType>();
  const [survey, setSurvey] = useState<SurveyType>();
  const [translation, setTranslation] = useState<string>("");
  const [surveyTranslated, setSurveyTranslated] = useState<SurveyType>();

  const handleGetEvent = useCallback(
    async (surveyID: UUID) => {
      setLoading(true);
      const surveyData = await SurveysAPI.getBySurveyID(surveyID);
      if (surveyData) {
        setSurvey(surveyData);
        const eventData = await EventsAPI.getByEnvetID(surveyData.eventID);
        setEvent(eventData);
        setLoading(false);
      } else {
        navigate(ROUTES.HOME);
      }
    },
    [navigate, setLoading]
  );

  useEffect(() => {
    if (params.surveyID) handleGetEvent(params.surveyID);
  }, [handleGetEvent, params.surveyID]);

  const renderSurvey = (s: any) => (
    <>
      {s?.questions && s.questions.length && s.questions.map((q: any) => {
          return (
            <div className="ml-2 mb-4">
              <h2>{`${q.order} - ${q.text}`}</h2>
              {q.answers &&
                !!q.answers.length &&
                q.answers.map((a: any) => {
                  return <h4 className="ml-6">{a.text}</h4>;
                })}
            </div>
          );
        })}
    </>
  );

  const translate = async () => {
    // await SurveysAPI.translate(survey?.surveyID as UUID, 'en');
    const newSurvey: SurveyType = JSON.parse(JSON.stringify(survey));
    newSurvey.language = (translation === 'en' ? "US" : translation?.toLocaleUpperCase()) as LANGUAGES;
    for (let q of (newSurvey.questions || [] as SurveyQuestionType[])) {
      const tQuestion = await Predictions.convert({
        translateText: { source: { text: q.text }, targetLanguage: translation },
      });
      q.text = tQuestion.text;
      for (let a of q.answers) {
        const tAnswer = await Predictions.convert({
          translateText: { source: { text: a.text }, targetLanguage: translation },
        });
        a.text = tAnswer.text;
      }
    }
    setSurveyTranslated(newSurvey);
    console.log(newSurvey)
  };

  return (
    <div className="flex flex-row gap-2">
      <div className="w-6/12 p-2 bg-white">
      <h1 className="font-bold mb-4 text-center">
        {event?.name} | Pesquisa em{" "}
        {LANGUAGESLABELS[survey?.language as LANGUAGES]}
      </h1>
      {renderSurvey(survey)}
        </div>
      <div className="w-6/12 p-2 bg-white">
        <div className="mb-4">
          <select onChange={(e) => setTranslation(e.target.value)}>
            <option value="en">US</option>
            <option value="es">ES</option>
            <option value="fr">FR</option>
            <option value="de">DE</option>
            <option value="ir">IT</option>
          </select>
          <button onClick={() => translate()}>Traduzir</button>
        </div>
        {renderSurvey(surveyTranslated)}
      </div>
    </div>
  );
}
