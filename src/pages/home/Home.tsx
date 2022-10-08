import { PLANSTYPES } from '../../interfaces/enums';
import DashboardRow from '../dashboard/DashboardRow';

export default function Dashboard() {
	return (
		<div className="grid gap-4">
      <DashboardRow type={PLANSTYPES.ADVANCED} />
		</div>
	);
}