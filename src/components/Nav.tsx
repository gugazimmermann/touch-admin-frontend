import { ReactElement, useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import { NavAlert, NavInfo } from ".";
import { AppContext } from "../context";
import { showLink } from "../helpers";
import LogoIcon from "../images/LogoIcon";
import { ROUTES } from "../interfaces/enums";
import NavProfile from "./NavProfile";

const projectName = process.env.REACT_APP_TITLE || "Touch Sistemas";

type NavProps = {
  handleSignOut: () => void;
};

const Nav = ({ handleSignOut }: NavProps): ReactElement => {
	const { state } = useContext(AppContext);
  const location = useLocation();
  
  return (
    <nav className="w-full shadow-md z-30 px-2 py-1.5 bg-white text-slate-500">
      <div className="container mx-auto flex flex-wrap justify-center sm:justify-between">
        <Link
          to={showLink(state) ? ROUTES.HOME : ROUTES.ALERTS}
          className="flex flex-row items-center text-primary mb-2 sm:mb-0"
        >
          <LogoIcon styles="h-8 w-8" />
          <p className="text-2xl">{projectName}</p>
        </Link>
        <div className="w-auto flex flex-row gap-4 items-center">
        {showLink(state) ? (
						<Link to={ROUTES.HOME}>
							<i
								className={`bx ${location.pathname === ROUTES.HOME ? 'bxs' : 'bx'}-grid-alt text-3xl`}
							/>
						</Link>
					) : (
						<i className="bx bx-grid-alt text-3xl" />
					)}
					{showLink(state) ? (
						<Link to={ROUTES.NEW}>
							<i
								className={`bx ${location.pathname === ROUTES.NEW ? 'bxs' : 'bx'}-message-alt-add text-3xl`}
							/>
						</Link>
					) : (
						<i className="bx bx-message-alt-x text-3xl" />
					)}
          {!!state.info.length && <NavInfo qtd={0} />}
          {!!state.alerts.length && <NavAlert />}
          <NavProfile handleSignOut={handleSignOut} qtd={0} />

        </div>
      </div>
    </nav>
  );
};

export default Nav;
