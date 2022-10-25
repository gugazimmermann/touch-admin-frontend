import DatePicker from "react-multi-date-picker";
import { Input, Select } from "../../components";
import { normalizeCEP } from "../../helpers";
import { BrazilMonths, BrazilStates, BrazilWeekDays, PLANSTYPES } from "../../interfaces/enums";
import { EventType } from "../../interfaces/types";

type EventsFormStepOneProps = {
  formEvent: EventType;
  setFormEvent: (formEvent: EventType) => void;
  type: PLANSTYPES;
}

const EventsFormStepOne = ({formEvent, setFormEvent, type}: EventsFormStepOneProps) => {

  const handleDatesChange = (value: any) => {
    const dates = value.toString().split(",");
    setFormEvent({ ...formEvent, dates });
  };

  return (
    <div className="flex flex-wrap w-full">
      <div className="w-full md:w-4/12 sm:pr-4 mb-4">
        <Input
          type="text"
          placeholder="Nome *"
          value={formEvent.name || ""}
          handler={(e) =>
            setFormEvent({ ...formEvent, name: e.target.value })
          }
        />
      </div>
      <div className="w-full md:w-4/12 sm:pr-4 mb-4">
        <Input
          type="text"
          value={formEvent.email || ""}
          placeholder="Email"
          handler={(e) =>
            setFormEvent({ ...formEvent, email: e.target.value })
          }
        />
      </div>
      <div className="w-full md:w-4/12 mb-4">
        <Input
          type="text"
          value={formEvent.website || ""}
          placeholder="WebSite"
          handler={(e) =>
            setFormEvent({ ...formEvent, website: e.target.value })
          }
        />
      </div>
      <div className="w-full md:w-4/12 sm:pr-4 mb-4">
        <Input
          type="text"
          value={formEvent.zipCode || ""}
          placeholder="CEP *"
          handler={(e) =>
            setFormEvent({
              ...formEvent,
              zipCode: normalizeCEP(e.target.value),
            })
          }
        />
      </div>
      <div className="w-full md:w-4/12 sm:pr-4 mb-4">
        <Select
          placeholder="Estado"
          value={formEvent.state || ""}
          handler={(e) =>
            setFormEvent({ ...formEvent, state: e.target.value })
          }
        >
          <>
            <option value="">Estado *</option>
            {BrazilStates.map((s) => (
              <option key={s.value} value={s.value}>
                {s.name}
              </option>
            ))}
          </>
        </Select>
      </div>
      <div className="w-full md:w-4/12 mb-4">
        <Input
          type="text"
          value={formEvent.city || ""}
          placeholder="Cidade *"
          handler={(e) =>
            setFormEvent({ ...formEvent, city: e.target.value })
          }
        />
      </div>
      <div className="w-full md:w-4/12 sm:pr-4 mb-4">
        <Input
          type="text"
          value={formEvent.district || ""}
          placeholder="Bairro"
          handler={(e) =>
            setFormEvent({ ...formEvent, district: e.target.value })
          }
        />
      </div>
      <div className="w-full md:w-4/12 sm:pr-4 mb-4">
        <Input
          type="text"
          value={formEvent.street || ""}
          placeholder="Rua"
          handler={(e) =>
            setFormEvent({ ...formEvent, street: e.target.value })
          }
        />
      </div>
      <div className="w-full md:w-4/12 mb-4">
        <Input
          type="text"
          value={formEvent.number || ""}
          placeholder="Número"
          handler={(e) =>
            setFormEvent({ ...formEvent, number: e.target.value })
          }
        />
      </div>
      <div className="w-full md:w-4/12 sm:pr-4 mb-4">
        <Input
          type="text"
          value={formEvent.complement || ""}
          placeholder="Complemento"
          handler={(e) =>
            setFormEvent({ ...formEvent, complement: e.target.value })
          }
        />
      </div>
      {type !== PLANSTYPES.SUBSCRIPTION && (
        <div className="w-full md:w-8/12 mb-4">
          <DatePicker
            onChange={handleDatesChange}
            value={formEvent.dates}
            format="DD/MM/YYYY"
            multiple
            weekDays={BrazilWeekDays}
            months={BrazilMonths}
            minDate={new Date()}
            style={{
              height: "40px",
            }}
            placeholder="Datas do Evento *"
          />
        </div>
      )}
    </div>
  );
}

export default EventsFormStepOne;