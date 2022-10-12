import { ReactElement, useState } from "react";
import ReactFlagsSelect from "react-flags-select";
import { SurveyType } from "../../../interfaces/types";
import { ConfirmationDialog, Form, Title } from "../../../components";
import { LANGUAGES, LANGUAGESLABELS } from "../../../interfaces/enums";

type SurveysLanguageProps = {
  survey: SurveyType;
  setSurvey: (survey: SurveyType) => void;
  resetSurvey: () => void;
  resetQuestion: () => void;
};

export default function SurveysLanguage({
  survey,
  setSurvey,
  resetSurvey,
  resetQuestion,
}: SurveysLanguageProps): ReactElement {
  const [open, setOpen] = useState<boolean>(false);

  const reset = () => {
    resetSurvey();
    resetQuestion();
    setOpen(false)
  };

  const handleResetLanguage = () => {
    if (!survey.questions.length) reset();
    else setOpen(true)
  };

  return (
    <>
      {survey.language ? (
        <>
          <Title
            text={`Pesquisa em ${LANGUAGES[survey.language]}`}
            className="font-bold text-center mt-2"
            help={
              <div className="flex flex-row justify-center items-center mt-2">
                <button onClick={() => handleResetLanguage()}>Cancelar</button>
              </div>
            }
          />
          {open && (
            <ConfirmationDialog
              open={open}
              setOpen={() => setOpen(!open)}
              handleConfirm={() => reset()}
              cancelText="Cancelar"
              confirmText="Enviar"
              confirmColor="bg-red-500"
            >
              <span>Todas as Perguntas serão perdidas!</span>
            </ConfirmationDialog>
          )}
        </>
      ) : (
        <Form>
          <div className="w-full flex  justify-center">
            <ReactFlagsSelect
              placeholder="Selecione um Idioma"
              countries={Object.keys(LANGUAGES)}
              customLabels={LANGUAGESLABELS}
              selected={survey.language}
              onSelect={(code: string) =>
                setSurvey({ ...survey, language: code as LANGUAGES })
              }
            />
          </div>
        </Form>
      )}
    </>
  );
}
