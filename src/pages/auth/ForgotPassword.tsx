import { useEffect, useState } from "react";
import { useLocation, useOutletContext } from "react-router-dom";
import { Button, Input, Link } from "../../components";
import { validateEmail } from "../../helpers";
import { ROUTES } from "../../interfaces/enums";
import { AlertType, LocationType, useOutletContextProps } from "../../interfaces/types";
import Image from "../../images/auth/ForgorPassword.svg";

export default function ForgorPassword() {
  const location: LocationType = useLocation();
  const { setAlert, setImage, setTitle, sendForgotPasswordCode }: useOutletContextProps = useOutletContext();
  const [email, setEmail] = useState("");

  useEffect(
    () => setAlert((location.state?.alert as AlertType) || {}),
    [location.state?.alert, setAlert]
  );
  useEffect(() => setImage(Image), [setImage]);
  useEffect(() => setTitle("Recuperar Senha"), [setTitle]);

  const disabled = () => email === "" || !validateEmail(email);

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
        <Button
          text="Enviar Código"
          disabled={disabled()}
          handler={() => sendForgotPasswordCode(email)}
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
