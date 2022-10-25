import { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../../context';
import { ROUTES } from '../../interfaces/enums';
import DashboardRow from '../dashboard/DashboardRow';

export default function Dashboard() {
	const navigate = useNavigate();
	const { state } = useContext(AppContext);

	useEffect(() => {
		if (state.alerts.length) navigate(ROUTES.ALERTS)
	}, [navigate, state.alerts.length]);

	return (
		<div className="grid gap-4">
      <DashboardRow />
		</div>
	);
}