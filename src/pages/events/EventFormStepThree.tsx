import MDEditor from "@uiw/react-md-editor";
import rehypeSanitize from "rehype-sanitize";
import { Input, InputFile } from "../../components";
import { PLANSTYPES } from "../../interfaces/enums";
import { EventType } from "../../interfaces/types";

type EventFormStepThreeProps = {
  formEvent: EventType;
  setFormEvent: (formEvent: EventType) => void;
  type: PLANSTYPES;
  fileName: string;
  handleFile: (e: React.FormEvent<HTMLInputElement>) => void;
}

const EventFormStepThree = ({formEvent, setFormEvent, type, fileName, handleFile}: EventFormStepThreeProps) => {
  return (
    <div className="flex flex-wrap w-full">
      {type !== PLANSTYPES.ADVANCED && (
        <div className="w-full md:w-6/12 sm:pr-4 mb-4">
          <Input
            value={formEvent.referralCode || ""}
            handler={(e) =>
              setFormEvent({ ...formEvent, referralCode: e.target.value })
            }
            type="text"
            placeholder="Código de Referência"
          />
          <small>
            {formEvent.referral &&
              `Referência: ${formEvent.referral?.company} / ${formEvent.referral?.contact}`}
          </small>
        </div>
      )}
      <div
        className={`w-full ${type !== PLANSTYPES.ADVANCED && "md:w-6/12"} mb-4`}
      >
        <InputFile fileName={fileName} handler={(e) => handleFile(e)} />
      </div>
      {formEvent.gift === "Sim" && (
        <div
          className={`w-full ${
            formEvent.prizeDraw === "Sim" && "md:w-6/12"
          } sm:pr-4  mb-4`}
        >
          <h4 className="text-center mb-2">
            Breve descrição do <strong>Brinde</strong>
          </h4>
          <MDEditor
            value={formEvent.giftDescription}
            onChange={(text) =>
              setFormEvent({ ...formEvent, giftDescription: text })
            }
            previewOptions={{
              rehypePlugins: [[rehypeSanitize]],
            }}
          />
        </div>
      )}
      {formEvent.prizeDraw === "Sim" && (
        <div
          className={`w-full ${
            formEvent.gift === "Sim" && "md:w-6/12"
          } sm:pr-4  mb-4`}
        >
          <h4 className="text-center mb-2">
            Breve descrição do <strong>Sorteio Final</strong>
          </h4>
          <MDEditor
            value={formEvent.prizeDrawDescription}
            onChange={(text) =>
              setFormEvent({ ...formEvent, prizeDrawDescription: text })
            }
            previewOptions={{
              rehypePlugins: [[rehypeSanitize]],
            }}
          />
        </div>
      )}
      <div className="w-full mb-4">
        <h4 className="text-center mb-2">
          {type === PLANSTYPES.SUBSCRIPTION ? "Breve Descrição" : "Breve descrição do Evento"}
        </h4>
        <MDEditor
          value={formEvent.description}
          onChange={(text) =>
            setFormEvent({ ...formEvent, description: text })
          }
          previewOptions={{
            rehypePlugins: [[rehypeSanitize]],
          }}
        />
      </div>
    </div>
  );
}

export default EventFormStepThree;
