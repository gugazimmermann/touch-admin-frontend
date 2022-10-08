import { ReactElement } from 'react';
import { Link } from 'react-router-dom';
import { PLANSTYPES, ROUTES } from '../../interfaces/enums';
import { EventType } from '../../interfaces/types';

const LOGO_MAPS_BUCKET = process.env.REACT_APP_LOGO_MAPS_BUCKET || "";


type DashboardCardProps = {
	type: PLANSTYPES;
	content: EventType;
}

export default function DashboardCard({ type, content }: DashboardCardProps): ReactElement {
	return (
		<Link to={`${ROUTES.EVENTS}/${content.eventID}`} key={content.eventID} className="flex flex-col justify-between shadow-md rounded-lg">
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
			<div className="p-4 text-center">
				<h3 className="font-semibold">{content.name}</h3>
				<p className="text-sm">{`${content.city} - ${content.state}`}</p>
			</div>
		</Link>
	);
}
