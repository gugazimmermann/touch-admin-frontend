import { ReactElement } from "react";

type SelectProps = {
  placeholder: string;
  value: string | number;
  handler: (e: { target: HTMLSelectElement }) => void;
  children: ReactElement;
  disabled?: boolean;
};

const Select = ({ placeholder, value, handler, children, disabled}: SelectProps): ReactElement => (
  <select
    placeholder={placeholder}
    value={value}
    onChange={handler}
    disabled={disabled}
    className="block w-full px-4 py-2 font-normal text-slate-700 bg-stone-100 border border-stone-400 rounded-md m-0"
  >
    {children}
  </select>
);

export default Select;
