import { useState, useEffect } from "react";
import { useOutletContext, useLocation } from "react-router-dom";
import { AlertType, LocationType, useOutletContextProps } from "../../interfaces/types";
import { Input, RememberMe, Button, Link } from "../../components";
import { validateEmail } from "../../helpers";
import Image from "../../images/auth/SignIn.svg";
import { ROUTES } from '../../interfaces/enums';

export default function SignIn() {
  const { setAlert, setImage, setTitle }: useOutletContextProps = useOutletContext();
  const location: LocationType = useLocation();
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const [remember, setRemember] = useState(false);

  useEffect(
    () => setAlert((location.state?.alert as AlertType) || {}),
    [location.state?.alert, setAlert]
  );
  useEffect(() => setImage(Image), [setImage]);
  useEffect(() => setTitle("Entrar"), [setTitle]);

  const disabled = () => email === "" || !validateEmail(email) || pwd === "";

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
          type="password"
          placeholder="Senha"
          value={pwd}
          handler={(e) => setPwd(e.target.value)}
        />
      </div>
      <div className="flex justify-between items-center mb-4">
        <RememberMe remember={remember} setRemember={setRemember} />
        <Link
          to={ROUTES.FORGOTPASSWORD}
          text="Recuperar Senha"
        />
      </div>
      <div className="mb-4">
        <Button
          text="Entrar"
          disabled={disabled()}
          handler={() => {}}
          full
        />
      </div>
      <div className="w-full text-center mt-4">
        <Link
          to={ROUTES.SIGNUP}
          text="Cadastrar"
          className="text-xl font-bold"
        />
      </div>
    </form>
  );
}
