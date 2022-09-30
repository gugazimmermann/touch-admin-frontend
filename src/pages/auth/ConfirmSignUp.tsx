import { useState, useEffect } from "react";
import { useLocation, useOutletContext, useSearchParams } from "react-router-dom";
import { Input, Button, Link } from "../../components";
import { validateEmail } from "../../helpers";
import { ROUTES } from "../../interfaces/enums";
import { LocationType, useOutletContextProps, AlertType } from "../../interfaces/types";
import Image from "../../images/auth/ConfirmSignUp.svg";

export default function ConfirmSignUp() {
  const location: LocationType = useLocation();
  const { setAlert, setImage, setTitle, resendConfirmationCode, confirmSignUp }: useOutletContextProps = useOutletContext();
  const [searchParams] = useSearchParams();
  const [email, setEmail] = useState(location.state?.email || "");
  const [code, setCode] = useState("");

  useEffect(
    () => setAlert((location.state?.alert as AlertType) || {}),
    [location.state?.alert, setAlert]
  );
  useEffect(() => setImage(Image), [setImage]);
  useEffect(() => setTitle("Confirmar Cadastro"), [setTitle]);

  useEffect(() => {
    if (searchParams.get("email")) setEmail(searchParams.get("email") || "");
    if (searchParams.get("code")) setCode(searchParams.get("code") || "");
  }, [searchParams]);

  const disabled = () =>
    email === "" || !validateEmail(email) || code === "" || code.length < 6;

  return (
    <form>
      <div className="mb-4">
        <Input
          type="email"
          placeholder="Email"
          value={email}
          handler={(e) => setEmail(e.target.value)}
        />
      </div>
      <div className="mb-4">
        <Input
          type="text"
          placeholder="Código"
          value={code}
          handler={(e) => setCode(e.target.value)}
        />
      </div>
      <div className="mb-4 flex justify-end duration-200 transition ease-in-out">
        <button type="button" onClick={() => resendConfirmationCode(email)}>
          Re-Enviar Código
        </button>
      </div>
      <div className="mb-4">
        <Button
          text="Confirmar Cadastro"
          disabled={disabled()}
          handler={() => confirmSignUp(email, code)}
          full
        />
      </div>
      <div className="w-full text-center mt-4">
        <Link
          to={ROUTES.SIGNIN}
          text="Voltar para Entrar"
          className="text-xl font-bold"
        />
      </div>
    </form>
  );
}
