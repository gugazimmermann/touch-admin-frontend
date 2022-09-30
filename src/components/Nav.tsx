import { ReactElement } from "react";
import { Link } from "react-router-dom";
import LogoIcon from "../images/LogoIcon";
import { ROUTES } from '../interfaces/enums';
import NavProfile from "./NavProfile";

const projectName = process.env.REACT_APP_TITLE || "Touch Sistemas";

type NavProps = {
  handleSignOut: () => void;
}

const Nav = ({ handleSignOut }: NavProps): ReactElement => {
	return (
		<nav className="w-full shadow-md z-30 px-2 py-1.5 bg-white text-slate-500">
			<div className="container mx-auto flex flex-wrap justify-center sm:justify-between">
				<Link to={ROUTES.HOME} className="flex flex-row items-center text-primary mb-2 sm:mb-0">
					<LogoIcon styles="h-8 w-8" />
					<p className="text-2xl">{projectName}</p>
				</Link>
				<div className="w-auto flex flex-row gap-4 items-center">
					<NavProfile handleSignOut={handleSignOut} qtd={0} />
				</div>
			</div>
		</nav>
	);
}

export default Nav;
