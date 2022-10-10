import { ReactElement } from "react";
import { Link } from "react-router-dom";
import { PLANSTYPES, ROUTES } from "../../interfaces/enums";
import { EventType } from "../../interfaces/types";
import { DateTime } from "luxon";

const LOGO_MAPS_BUCKET = process.env.REACT_APP_LOGO_MAPS_BUCKET || "";

type DashboardCardProps = {
  content: EventType;
};

export default function DashboardCard({
  content,
}: DashboardCardProps): ReactElement {
  return (
    <Link
      to={`${ROUTES.EVENTS}/${content.eventID}`}
      key={content.eventID}
      className={`flex flex-col justify-between shadow-md rounded-lg ${
        content.planType === PLANSTYPES.ADVANCED
          ? "bg-orange-50"
          : content.planType === PLANSTYPES.BASIC
          ? "bg-emerald-50"
          : "bg-sky-50"
      }`}
    >
      <div className="w-full bg-gray-200 rounded-t-lg overflow-hidden">
        {content.logo ? (
          <img
            src={`https://${LOGO_MAPS_BUCKET}.s3.amazonaws.com${content?.logo}`}
            alt={content.name}
            className="w-full h-full object-center object-cover group-hover:opacity-75"
          />
        ) : (
          <img
            src="/image-placeholder.png"
            alt={content.name}
            className="w-full h-full object-center object-cover opacity-10  group-hover:opacity-5"
          />
        )}
      </div>
      <div className="p-2 py-4 text-center">
        <h3 className="font-semibold">{content.name}</h3>
        <p className="text-sm">{`${content.city} - ${content.state}`}</p>
        <p className="text-sm">
          {content.dates
            .map((d) =>
              DateTime.fromFormat(d, "yyyy-MM-dd").toFormat("dd/MM/yy")
            )
            .join(" | ")}
        </p>
      </div>
    </Link>
  );
}
