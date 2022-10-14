import { useState, useCallback, useEffect } from "react";
import { useParams, useNavigate, useOutletContext } from "react-router-dom";
import ReactFlagsSelect from "react-flags-select";
import { v4 as uuidv4 } from "uuid";
import { Predictions } from "aws-amplify";
import EventsAPI from "../../api/events";
import SurveysAPI from "../../api/surveys";
import { LANGUAGES, LANGUAGESFLAGS, ROUTES } from "../../interfaces/enums";
import {
  useOutletContextProfileProps,
  UUID,
  EventType,
  SurveyType,
  SurveyQuestionType,
  SurveySimpleType,
} from "../../interfaces/types";
import { LoadingSmall } from "../../components";
import { getObjKey } from "../../helpers";

export default function SurveysEdit() {
  const params = useParams();
  const navigate = useNavigate();
  const { setLoading } = useOutletContext<useOutletContextProfileProps>();
  const [event, setEvent] = useState<EventType>();
  const [survey, setSurvey] = useState<SurveySimpleType>();
  const [selectedToTranslate, setSelectedToTranslate] = useState<UUID[]>([]);
  const [translation, setTranslation] = useState<string>("");
  const [loadingTranslation, setLoadingTranslation] = useState<boolean>(false);
  const [surveyTranslated, setSurveyTranslated] = useState<SurveyType>();

  const handleGetEvent = useCallback(
    async (surveyID: UUID, language: string) => {
      setLoading(true);
      const surveyData = await SurveysAPI.getBySurveyID(surveyID);
      if (!surveyData) navigate(ROUTES.HOME);
      const s = surveyData.surveys.find(
        (x) => x.language === LANGUAGES[language]
      );
      if (!s) navigate(`${ROUTES.EVENTS}/${surveyData.eventID}`);
      setSurvey(s);
      const eventData = await EventsAPI.getByEnvetID(surveyData.eventID);
      setEvent(eventData);
      setLoading(false);
    },
    [navigate, setLoading]
  );

  useEffect(() => {
    if (params.surveyID && params.language)
      handleGetEvent(params.surveyID, params.language);
    else navigate(ROUTES.HOME);
  }, [handleGetEvent, navigate, params.language, params.surveyID]);

  const handleOnChange = (id: UUID) => {
    let newArray: UUID[] = selectedToTranslate.map((x) => x);
    if (newArray.includes(id)) newArray = newArray.filter((x) => x !== id);
    else newArray.push(id);
    setSelectedToTranslate(newArray);
  };

  const renderSurvey = (s: any) => (
    <>
      {s?.questions &&
        s.questions.length &&
        s.questions.map((q: any) => {
          return (
            <div className="ml-2 mb-4" key={q.id}>
              <div className="flex flex-row gap-2 justify-start items-center">
                <input
                  type="checkbox"
                  name="toTranslate"
                  id={q.id}
                  value={q.id}
                  onChange={() => handleOnChange(q.id)}
                />
                <h2>{q.text}</h2>
              </div>
              {q.answers &&
                !!q.answers.length &&
                q.answers.map((a: any) => {
                  return (
                    <div
                      className="flex flex-row gap-2 justify-start items-center ml-6"
                      key={a.id}
                    >
                      <input
                        type="checkbox"
                        name="toTranslate"
                        id={a.id}
                        value={a.id}
                        onChange={() => handleOnChange(a.id)}
                      />
                      <h4>{a.text}</h4>
                    </div>
                  );
                })}
            </div>
          );
        })}
    </>
  );

  const handleTranslate = async () => {
    setLoadingTranslation(true);
    const newSurvey: SurveyType = JSON.parse(JSON.stringify(survey));
    newSurvey.surveyID = uuidv4();
    newSurvey.language = translation === "en" ? "US" : translation?.toLocaleUpperCase();
    for (let q of newSurvey.questions || ([] as SurveyQuestionType[])) {
      if (selectedToTranslate.includes(q.id)) {
        const tQuestion = await Predictions.convert({
          translateText: {
            source: { text: q.text },
            targetLanguage: LANGUAGES[translation.toLocaleUpperCase()],
          },
        });
        q.text = tQuestion.text;
      }
      for (let a of q.answers) {
        if (selectedToTranslate.includes(a.id)) {
          const tAnswer = await Predictions.convert({
            translateText: {
              source: { text: a.text },
              targetLanguage: LANGUAGES[translation.toLocaleUpperCase()],
            },
          });
          a.text = tAnswer.text;
        }
      }
    }
    setSurveyTranslated(newSurvey);
    setLoadingTranslation(false);
  };

  const renderSurveyTitle = () => {
    const l = getObjKey(LANGUAGES, survey?.language || "") || "";
    return (
      <h1 className="font-bold mb-4 text-center">
        {`${event?.name} | Pesquisa em ${LANGUAGESFLAGS[l]}`}
      </h1>
    );
  };

  return (
    <div className="flex flex-row gap-2">
      <div className="w-6/12 p-2 bg-white">
        {renderSurveyTitle()}
        {renderSurvey(survey)}
      </div>
      <div className="w-6/12 p-2 bg-white">
        <div className="mb-4 flex flex-row justify-evenly">
          <ReactFlagsSelect
            placeholder="Selecione um Idioma"
            countries={Object.keys(LANGUAGESFLAGS)}
            customLabels={LANGUAGESFLAGS}
            selected={translation.toLocaleUpperCase()}
            onSelect={(code: string) => setTranslation(code.toLocaleLowerCase())}
            className="w-6/12"
          />
          <button
            type="button"
            className="px-4 text-white font-bold bg-primary rounded-md shadow-md"
            onClick={() => handleTranslate()}
          >
            Traduzir
          </button>
        </div>
        {loadingTranslation ? <LoadingSmall /> : renderSurvey(surveyTranslated)}
      </div>
    </div>
  );
}
