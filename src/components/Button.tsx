import { ReactElement } from "react";

type AuthButtonProps = {
  text: string;
  disabled?: boolean;
  handler: () => void;
  full?: boolean;
  update?: boolean;
};

const AuthButton = ({ text, disabled, handler, full, update }: AuthButtonProps): ReactElement => (
  <button
    type="button"
    onClick={handler}
    disabled={disabled}
    className={`${
      disabled
        ? "bg-gray-600 cursor-not-allowed"
        : `${!update ? 'bg-primary' : 'bg-warning'} cursor-pointer hover:bg-secondary`
    } px-2 py-2 text-white font-medium uppercase rounded-md shadow-md transition duration-150 ease-in-out ${full && 'inline-block w-full'}`}
  >
    {text}
  </button>
);

export default AuthButton;
