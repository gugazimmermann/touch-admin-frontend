import { Dispatch, SetStateAction, useState, useEffect, useCallback } from 'react';
import { Input, Select } from "../../components";
import { PLANSTYPES } from "../../interfaces/enums";
import { EventType } from "../../interfaces/types";
import smsPrice from '../../helpers/smsPrice';

type EventsFormStepTwoProps = {
  formEvent: EventType;
  setFormEvent: Dispatch<SetStateAction<EventType>>;
  type: PLANSTYPES;
}

const EventFormStepTwo = ({formEvent, setFormEvent, type}: EventsFormStepTwoProps) => {
  const [sms, setSMS] = useState(0);


  const seeSMSPrice = useCallback(async () => {
    const smsprice = await smsPrice();
    setSMS(smsprice);
  }, [])

  useEffect(() => {
    seeSMSPrice();
  }, [seeSMSPrice]);

  return (
    <div className="flex flex-wrap w-full">
      <div className="w-full md:w-6/12 sm:pr-4 mb-4">
        <Select
          value={formEvent.method || ""}
          handler={(e) =>
            setFormEvent({ ...formEvent, method: e.target.value })
          }
          disabled={type !== PLANSTYPES.ADVANCED}
          placeholder="Método"
        >
          <>
            <option value="">Método *</option>
            <option value="SMS">SMS</option>
            <option value="EMAIL">EMAIL</option>
          </>
        </Select>
        <small>{formEvent.method === "SMS" && `* R$ ${sms} por envio - aprox.`}</small>
      </div>
      <div className="w-full md:w-6/12 mb-4">
        <Select
          value={formEvent.gift || ""}
          handler={(e) =>
            setFormEvent({ ...formEvent, gift: e.target.value })
          }
          disabled={type !== PLANSTYPES.ADVANCED}
          placeholder="Brinde?*"
        >
          <>
            <option value="">Brinde *</option>
            <option value="Sim">Sim</option>
            <option value="Não">Não</option>
          </>
        </Select>
      </div>
      <div className="w-full md:w-6/12 sm:pr-4 mb-4">
        <Select
          value={formEvent.prizeDraw || ""}
          handler={(e) =>
            setFormEvent({ ...formEvent, prizeDraw: e.target.value })
          }
          disabled={type !== PLANSTYPES.ADVANCED}
          placeholder="Sorteio Final?*"
        >
          <>
            <option value="">Sorteio Final? *</option>
            <option value="Sim">Sim</option>
            <option value="Não">Não</option>
          </>
        </Select>
      </div>
      <div className="w-full md:w-6/12 mb-4">
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
    </div>
  );
}

export default EventFormStepTwo;
