import { useState, useEffect, useCallback, ReactElement } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import slugify from "slugify";
import QRCode from "qrcode";
import { DateTime } from "luxon";
import { Alert } from "../../components";
import { ALERT, PLANSTYPES, ROUTES } from "../../interfaces/enums";
import { EventType, UUID } from "../../interfaces/types";
import EventsAPI from "../../api/events";
import { normalizeCEP } from "../../helpers";

const LOGO_MAPS_BUCKET = process.env.REACT_APP_LOGO_MAPS_BUCKET || "";
const EVENTS_URL = process.env.REACT_APP_EVENTS_URL || "";

export default function EventDetail() {
  const params = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [success] = useState(location?.state?.success || null);
  const [loading, setLoading] = useState(false);
  const [over, setOver] = useState<boolean>(false);
  const [event, setEvent] = useState<EventType>();
  const [qr, setQr] = useState("");

  const generateQRCode = useCallback(async (eventID: UUID) => {
    try {
      const url = await QRCode.toDataURL(`${EVENTS_URL}${eventID}`, {
        width: 3840,
      });
      setQr(url);
    } catch (error) {
      console.error(error);
    }
  }, []);

  const formatAddress = (event: EventType): string => {
    let address = event.street;
    if (event.number) address += `, ${event.number}`;
    if (event.complement) address += ` (${event.complement})`;
    address += ` - ${event.city} / ${event.state} | ${normalizeCEP(
      event.zipCode as string
    )}`;
    return address || "";
  }

  const handleGetEvent = useCallback(
    async (eventID: UUID) => {
      setLoading(true);
      const data = await EventsAPI.getByEnvetID(eventID);
      if (data) {
        const dates = data.dates.map((d) =>
          DateTime.fromFormat(d, "yyyy-MM-dd")
        );
        dates.sort();
        const seeOver = dates[0] <= DateTime.now();
        if (seeOver) setOver(true);
        generateQRCode(eventID);
        setEvent(data);
        setLoading(false);
      } else {
        navigate(ROUTES.HOME);
      }
    },
    [generateQRCode, navigate]
  );

  useEffect(() => {
    if (params.eventID) handleGetEvent(params.eventID);
  }, [handleGetEvent, params.eventID]);

  const renderDescriptionRow = (text: string, description: string): ReactElement => (
    <div className="p-2 border-b sm:grid sm:grid-cols-12">
      <dt className="text-sm font-medium sm:col-span-2 pr-2">{text}</dt>
      <dl className="text-sm sm:mt-0 sm:col-span-10 font-bold">{description}</dl>
    </div>
  );

  const renderSurveyRow = (): ReactElement => {
    const surveyQuestions = 0;
    return (
      <div className="p-2 border-b sm:grid sm:grid-cols-12">
        <dt className="text-sm font-medium sm:col-span-2">Pesquisa:</dt>
        <dl className="text-sm sm:mt-0 sm:col-span-4 font-bold">
          {!surveyQuestions ? "Não Cadastrada" : `${surveyQuestions} perguntas`}
        </dl>
        {!over && (
          <dl className="text-sm sm:mt-0 sm:col-span-6 text-right">
            <button
              type="button"
              className="px-2 py-0.5 bg-orange-300 border-orange-500 text-white rounded-lg"
            >
              Adicionar
            </button>
          </dl>
        )}
      </div>
    );
  }

  const renderQRCodeCard = (name: string): ReactElement => (
      <a
        href={qr}
        download={`${slugify(name, { lower: true })}.png`}
        className="cursor-pointer w-full flex flex-col justify-center items-center text-secondary"
      >
        <img src={qr} alt="qr code" />
        <h2 className="text-lg font-bold text-center mb-2">QR-Code Download</h2>
      </a>
    );

  const renderImg = (img: string | undefined, name: string): ReactElement => {
    return img ? (
      <img
        src={`https://${LOGO_MAPS_BUCKET}.s3.amazonaws.com${img}`}
        alt={name}
        className="w-full h-full object-center object-cover group-hover:opacity-75"
      />
    ) : (
      <img
        src="/image-placeholder.png"
        alt={name}
        className="w-full h-full object-center object-cover opacity-10  group-hover:opacity-5"
      />
    );
  };

  const renderLogoCard = (event: EventType): ReactElement => (
      <div className="w-full md:w-3/12">
        <div className="bg-white shadow-md overflow-hidden rounded-lg mb-4">
          {renderImg(event.logo, event.name)}
          <div className="my-2 text-center">
            <h3 className="font-bold">{event.name}</h3>
            <p className="mt-1 text-sm">
              {event.dates
                .map(
                  (d) =>
                    `${DateTime.fromFormat(d, "yyyy-MM-dd").toFormat(
                      "dd/MM/yy"
                    )}`
                )
                .join(", ")}
            </p>
          </div>
          {!over && (
            <button
              type="button"
              className="px-2 py-1 w-full bg-orange-300 border-orange-500 text-white rounded-b-lg"
            >
              Editar
            </button>
          )}
        </div>
      </div>
    );

  return (
    <>
      {success && (
        <Alert text="Evento Cadastrado com Sucesso" type={ALERT.SUCCESS} />
      )}
      {!loading && event && (
        <>
          <div className="flex flex-col md:flex-row justify-between items-center">
            {renderLogoCard(event)}
            <div className="w-full md:w-3/12 flex flex-rowv md:flex-col">
              <div className="bg-white shadow-md overflow-hidden rounded-lg mb-2 sm:w-6/12 md:w-full sm:mr-4">
                {renderQRCodeCard(event.name)}
              </div>
            </div>
          </div>
          <div className="shadow-md rounded-lg flex flex-col sm:flex-row">
            <dl className="flex-1">
              {renderDescriptionRow("Plano:", event.plan?.name || "")}
              {renderDescriptionRow("Método:", event.method || "")}
              {renderSurveyRow()}
              {event.website && renderDescriptionRow("Website", event.website)}
              {event.email && renderDescriptionRow("Email", event.email)}
              {renderDescriptionRow("Endereço:", formatAddress(event))}
              {event.referral && renderDescriptionRow("Referência:", `${event.referral.code} - ${event.referral.company} | ${event.referral.contact}`)}
            </dl>
            <div className="px-4 py-4 flex-1 justify-center">
              {renderImg(event.map, event.name)}
            </div>
          </div>
        </>
      )}
    </>
  );
}
