import { ReactElement, useState } from "react";
import { ConfirmationDialog, Title } from "../../../components";
import { ROUTES } from "../../../interfaces/enums";
import { EventType } from "../../../interfaces/types";

type SurveysTitleProps = {
  event?: EventType;
};

// TODO: create help text
export default function SurveysTitle({
  event,
}: SurveysTitleProps): ReactElement {
  const [open, setOpen] = useState<boolean>(false);

  return (
    <>
      <Title
        text={`${event?.name}`}
        back={`${ROUTES.EVENTS}/${event?.eventID}`}
        className="font-bold text-center"
        help={
          <button onClick={() => setOpen(!open)}>
            <i className="bx bx-help-circle text-xl" />
          </button>
        }
      />
      {open && (
        <ConfirmationDialog
          open={open}
          setOpen={() => setOpen(!open)}
          cancelText="Fechar"
        >
          <span>teste</span>
        </ConfirmationDialog>
      )}
    </>
  );
}
