import { ReactElement } from "react";

type NavInfoProps = {
  qtd: number;
};

const NavInfo = ({ qtd }: NavInfoProps): ReactElement => {
  return (
    <div className="relative">
      {qtd ? (
        <>
          <i className="bx bxs-message-rounded-error text-3xl" />
          <span className="absolute -top-1 -right-3 py-0 px-1.5 text-white bg-warning rounded-full text-xs">
            {qtd}
          </span>
        </>
      ) : (
        <i className="bx bx-message-rounded text-3xl" />
      )}
    </div>
  );
};

export default NavInfo;
