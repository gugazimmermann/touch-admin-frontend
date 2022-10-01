import { ReactElement } from "react";
import { ALERT } from "../../interfaces/enums";

type AlertCardProps = {
	index: string;
	type: ALERT
	children: ReactElement
}

const AlertCard = ({ index, type, children }: AlertCardProps): ReactElement => {

	const seeType = (t: ALERT) => {
		if (t === ALERT.ERROR) return 'bg-red-100 border border-red-300 text-red-700';
		if (t === ALERT.WARNING) return 'bg-amber-100 border border-amber-300 text-amber-700';
		if (t === ALERT.INFO) return 'bg-sky-100 border border-sky-300 text-sky-700';
		if (t === ALERT.SUCCESS) return 'bg-emerald-100 border border-emerald-300 text-emerald-700';
		return 'bg-amber-100 text-amber-700';
	};

	return (
		<div key={index} className={`${seeType(type)} relative mb-2 rounded-lg p-1.5 flex items-center shadow-md`} role="alert">
			<i className="bx bxs-error-circle text-2xl pr-2" />
			{children}
		</div>
	);
}

export default AlertCard;
