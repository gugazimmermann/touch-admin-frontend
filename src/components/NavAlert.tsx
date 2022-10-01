import { useContext, ReactElement } from 'react';
import { Link } from "react-router-dom";
import { AppContext } from "../context";
import { ROUTES } from '../interfaces/enums';

const NavAlert = (): ReactElement => {
  const { state } = useContext(AppContext);

  return (
    <div className="relative">
      {!!state.alerts.length ? (
        <Link to={ROUTES.ALERTS}>
          <i className="bx bxs-bell text-3xl" />
          <span className="absolute -top-1 -right-3 py-0 px-1.5 text-white bg-danger rounded-full text-xs">
            {state.alerts.length}
          </span>
        </Link>
      ) : (
        <i className="bx bx-bell text-3xl" />
      )}
    </div>
  );
};

export default NavAlert;
