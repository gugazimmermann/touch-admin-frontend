import { useState, useEffect, useCallback, ReactElement } from "react";
import { useParams, useLocation, useNavigate, Link } from "react-router-dom";
import slugify from "slugify";
import QRCode from "qrcode";
import { CSVLink } from "react-csv";
import { DateTime } from "luxon";
import {
  Alert,
  ConfirmationDialog,
  LoadingSmall,
  Select,
} from "../../components";
import {
  ALERT,
  LANGUAGESFLAGS,
  PLANSTYPES,
  ROUTES,
} from "../../interfaces/enums";
import { EventType, UUID, SurveyType, SurveyPostType, SurveySimpleType } from "../../interfaces/types";
import EventsAPI from "../../api/events";
import { getObjKey, normalizeCEP } from "../../helpers";
import SurveysAPI from "../../api/surveys";
import smsPrice from "../../helpers/smsPrice";
import { LANGUAGES } from '../../interfaces/enums';

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
  const [survey, setSurvey] = useState<SurveyPostType>();
  const [surveys, setSurveys] = useState<SurveySimpleType[]>([]);
  const [qr, setQr] = useState("");
  const [headers, setHeaders] = useState();
  const [data, setData] = useState();
  const [sms, setSMS] = useState(0);
  const [showMethodModal, setShowMethodModal] = useState<boolean>(false);
  const [newMethod, setNewMethod] = useState<string>("");

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
  };

  const handleGetEvent = useCallback(
    async (eventID: UUID) => {
      setLoading(true);
      const data = await EventsAPI.getByEnvetID(eventID);
      if (data.planType === PLANSTYPES.ADVANCED) {
        const smsprice = await smsPrice();
        setSMS(smsprice);
      }
      if (data) {
        const dates = data.dates.map((d) =>
          DateTime.fromFormat(d, "yyyy-MM-dd")
        );
        dates.sort();
        const seeOver = dates[0] <= DateTime.now();
        if (seeOver) setOver(true);
        const [surveyRes] = await SurveysAPI.getByEnvetID(data?.eventID as string);
        setSurvey(surveyRes);
        setSurveys(surveyRes?.surveys || []);
        generateQRCode(eventID);
        setNewMethod(data.method);
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
      <dl className="text-sm sm:mt-0 sm:col-span-10 font-bold">
        {description}
      </dl>
    </div>
  );

  const renderMethodRow = (): ReactElement => {
    return (
      <div className="p-2 border-b sm:grid sm:grid-cols-12">
        <dt className="text-sm font-medium sm:col-span-2 pr-2">Método</dt>
        <dl className="text-sm sm:mt-0 sm:col-span-6 font-bold">
          {event?.method === "SMS"
            ? `SMS (R$ ${sms} por envio - apox.)`
            : "Email"}
        </dl>
        <dl className="text-sm sm:mt-0 sm:col-span-4 text-right">
          <button
            type="button"
            className="px-2 py-0.5 bg-orange-300 border-orange-500 text-white rounded-lg"
            onClick={() => setShowMethodModal(!showMethodModal)}
          >
            Alterar
          </button>
        </dl>
      </div>
    );
  };

  const surveyList = () => {
    const res = surveys.map((s) => {
      const l = getObjKey(LANGUAGES, s.language) || "";
      return (
        <Link to={`${ROUTES.SURVEYS}/edit/${survey?.surveyID}/${l}`} className="underline">
          {LANGUAGESFLAGS[l]} ({s.questions.length})
        </Link>
      );
    });
    return res;
  };

  const renderSurveyRow = (): ReactElement => {
    return (
      <div className="p-2 border-b sm:grid sm:grid-cols-12">
        <dt className="text-sm font-medium sm:col-span-2">Pesquisa:</dt>
        <dl className="text-sm sm:mt-0 sm:col-span-6 font-bold">
          {(!surveys || !surveys.length) ? "Não Cadastrada" : surveyList()}
        </dl>
        {(!over && (!surveys || !surveys.length)) && (
          <dl className="text-sm sm:mt-0 sm:col-span-4 text-right">
            <button
              type="button"
              className="px-2 py-0.5 bg-orange-300 border-orange-500 text-white rounded-lg"
              onClick={() => {
                navigate(`${ROUTES.SURVEYS}/adicionar/${event?.eventID}`);
              }}
            >
              Adicionar
            </button>
          </dl>
        )}
      </div>
    );
  };

  const handleDashboard = (visitors: number, eventID: UUID): void => {
    console.log(eventID);
    // if (visitors) navigate(`${ROUTES.DASHBOARD}/${eventID}`, { state: { event, visitors } });
  };

  const renderDashboardCard = (
    visitors: number,
    eventID: UUID
  ): ReactElement => {
    return (
      <div
        role="presentation"
        onClick={() => handleDashboard(visitors, eventID)}
        className={`${
          visitors && "cursor-pointer"
        } w-full p-1 flex flex-col justify-center items-center text-secondary`}
      >
        <i className="bx bxs-pie-chart-alt-2 text-9xl" />
        <h2 className="text-lg font-bold">Relatório</h2>
      </div>
    );
  };

  const renderWinnerCard = (): ReactElement => (
    <div className="bg-white shadow-md overflow-hidden rounded-lg p-1 sm:w-6/12 md:w-full flex flex-col items-center align-middle">
      <i className="bx bxs-trophy text-primary text-5xl" />
      <h2 className="text-lg text-primary font-bold">Ganhador(a) do Sorteio</h2>
    </div>
  );

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
      <a
        href={`https://${LOGO_MAPS_BUCKET}.s3.amazonaws.com${img}`}
        className="cursor-pointer"
      >
        <img
          src={`https://${LOGO_MAPS_BUCKET}.s3.amazonaws.com${img}`}
          alt={name}
          className="w-full h-full object-center object-cover group-hover:opacity-75"
        />
      </a>
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
                  `${DateTime.fromFormat(d, "yyyy-MM-dd").toFormat("dd/MM/yy")}`
              )
              .join(", ")}
          </p>
        </div>
        {!over && (
          <button
            type="button"
            onClick={() => navigate(`${ROUTES.EDIT}/${event.eventID}`)}
            className="px-2 py-1 w-full bg-orange-300 border-orange-500 text-white rounded-b-lg"
          >
            Editar
          </button>
        )}
      </div>
    </div>
  );

  const changeMethod = async () => {
    if (newMethod !== event?.method) {
      setLoading(true);
      const eventID = event?.eventID || "";
      setShowMethodModal(!showMethodModal);
      await EventsAPI.method(eventID, newMethod);
      await handleGetEvent(eventID);
    }
  };

  return (
    <>
      {success && (
        <Alert text="Evento Cadastrado com Sucesso" type={ALERT.SUCCESS} />
      )}
      {!event || loading ? (
        <LoadingSmall />
      ) : (
        <>
          <div className="flex flex-col md:flex-row justify-between items-center">
            {renderLogoCard(event)}
            <div className="w-full md:w-3/12 flex flex-rowv md:flex-col">
              <div className="bg-white shadow-md overflow-hidden rounded-lg mb-2 sm:w-6/12 md:w-full sm:mr-4">
                {over
                  ? renderDashboardCard(10, event.eventID as UUID)
                  : renderQRCodeCard(event.name)}
              </div>
              {over && data && (
                <CSVLink
                  data={data}
                  headers={headers}
                  filename={slugify(event.name, { lower: true })}
                  className="px-2 py-1 bg-secondary text-white rounded-lg mb-2 shadow-md text-center font-bold"
                >
                  <i className="bx bxs-download" /> Exportar Dados
                </CSVLink>
              )}
              {over && renderWinnerCard()}
            </div>
          </div>
          <div className="shadow-md rounded-lg flex flex-col sm:flex-row">
            <dl className="flex-1">
              {renderDescriptionRow("Plano:", event.plan?.name || "")}
              {renderMethodRow()}
              {renderSurveyRow()}
              {event.website && renderDescriptionRow("Website", event.website)}
              {event.email && renderDescriptionRow("Email", event.email)}
              {renderDescriptionRow("Endereço:", formatAddress(event))}
              {event.referral &&
                renderDescriptionRow(
                  "Referência:",
                  `${event.referral.code} - ${event.referral.company} | ${event.referral.contact}`
                )}
            </dl>
            <div className="px-4 py-4 flex-none w-4/12 justify-center">
              {renderImg(event.map, event.name)}
            </div>
          </div>
        </>
      )}
      {showMethodModal && (
        <ConfirmationDialog
          open={showMethodModal}
          setOpen={setShowMethodModal}
          cancelText="Cancelar"
          confirmText="Alterar"
          confirmColor="bg-primary"
          handleConfirm={changeMethod}
        >
          <Select
            value={newMethod}
            handler={(e) => setNewMethod(e.target.value)}
            placeholder="Método"
          >
            <>
              <option value="SMS">SMS</option>
              <option value="EMAIL">EMAIL</option>
            </>
          </Select>
        </ConfirmationDialog>
      )}
    </>
  );
}
