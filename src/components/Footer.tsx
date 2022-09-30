import { ReactElement } from "react";

const projectName = process.env.REACT_APP_TITLE || "Touch Sistemas";

const Footer = (): ReactElement => {
    return (
      <footer className="h-10 flex flex-row justify-center items-center bg-text text-background">
        {`Frontend for ${projectName}`}
      </footer>
    );
};

export default Footer;
