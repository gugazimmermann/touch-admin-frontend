import { useState, ReactElement } from 'react';

type InputProps = {
  type: "password" | "email" | "text";
  placeholder: string;
  value: string | number;
  handler?: (e: { target: HTMLInputElement }) => void;
  disabled?: boolean;
  showTooltip?: boolean;
};

const Input = ({
  type,
  placeholder,
  value,
  handler,
  disabled,
  showTooltip,
}: InputProps): ReactElement => {
  const [inputType, setInputType] = useState(type);
  const [tooltip, setTooltip] = useState(false);

  function handleChangeInputType() {
    if (inputType === "password") setInputType("text");
    else if (inputType === "text") setInputType("password");
  }

  return (
    <div className="relative">
      <input
        type={inputType}
        value={value}
        onChange={handler}
        className="block w-full px-4 py-2 font-normal text-slate-700 bg-stone-100 border border-stone-400 rounded-md m-0"
        placeholder={placeholder}
        disabled={disabled}
      />
      {type === "password" && (
        <button
          type="button"
          onClick={() => handleChangeInputType()}
          className="absolute top-1.5 right-1"
        >
          <i
            className={`bx ${
              inputType === "password" ? "bx-hide" : "bx-show"
            } text-2xl text-slate-400`}
          />
        </button>
      )}
      {showTooltip && (
        <>
          <button
            type="button"
            onMouseOver={() => setTooltip(true)}
            onMouseLeave={() => setTooltip(false)}
            className="absolute top-1.5 right-8"
          >
            <i className="bx bx-info-circle text-2xl text-slate-400" />
          </button>
          <ul
            className={`${
              tooltip ? "flex" : "hidden"
            } flex-col text-left absolute -right-8 top-2 -translate-y-full w-56 px-2 py-1 bg-slate-700 text-slate-200 rounded-lg text-sm`}
          >
            <li>Mínimo 6 caracteres</li>
            <li>Pelo menos 1 número</li>
            <li>Pelo menos 1 letra maiúscula</li>
            <li>Pelo menos 1 letra minúscula</li>
          </ul>
        </>
      )}
    </div>
  );
};

export default Input;
