import { ReactElement, useState } from 'react';
import { ConfirmationDialog, Title } from "../../../components";
import { ROUTES } from "../../../interfaces/enums";
import { EventType } from "../../../interfaces/types";

type SurveysTitleProps = {
  event?: EventType;
  language: string;
};

// TODO: finish language sugestion
export default function SurveysTitle({
  event,
  language,
}: SurveysTitleProps): ReactElement {
  const [open, setOpen] = useState<boolean>(false);

  const confirmSend = () => {
    console.debug("Sujest new language!");
    setOpen(!open);
  };

  return (
    <>
      <Title
        text={`${event?.name}`}
        back={`${ROUTES.EVENTS}/${event?.eventID}`}
        className="font-bold text-center"
        help={!language ? <button onClick={() => setOpen(!open)}>Sugerir Novo Idoma</button> : undefined}
      />
      {open && (
        <ConfirmationDialog
          open={open}
          setOpen={() => setOpen(!open)}
          handleConfirm={() => confirmSend()}
          cancelText="Cancelar"
          confirmText="Enviar"
          confirmColor="bg-emerald-500"
        >
          <span>teste</span>
        </ConfirmationDialog>
      )}
    </>
  );
}
