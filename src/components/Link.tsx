import { ReactElement } from "react";
import { Link as RouterLink } from "react-router-dom";

type LinkProps = {
  to: string;
  text: string;
  className?: string;
};

const Link = ({ to, text, className }: LinkProps): ReactElement => (
  <RouterLink
    to={to}
    className={`hover:text-primary duration-200 transition ease-in-out ${
      className && className
    }`}
  >
    {text}
  </RouterLink>
);

export default Link;
