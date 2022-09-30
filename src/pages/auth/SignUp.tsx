
import { useEffect, useState } from "react";
import { useLocation, useOutletContext } from "react-router-dom";
import { Button, Input, Link } from "../../components";
import { validateEmail } from "../../helpers";
import { AlertType, LocationType, useOutletContextProps } from "../../interfaces/types";
import { ROUTES } from '../../interfaces/enums';
import Image from "../../images/auth/SignUp.svg";

export default function SignUp() {
  const location: LocationType = useLocation();
  const { setAlert, setImage, setTitle }: useOutletContextProps = useOutletContext();
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const [repeat, setRepeat] = useState("");

  useEffect(
    () => setAlert((location.state?.alert as AlertType) || {}),
    [location.state?.alert, setAlert]
  );
  useEffect(() => setImage(Image), [setImage]);
  useEffect(() => setTitle("Cadastrar"), [setTitle]);

  const disabled = () =>
    email === "" ||
    !validateEmail(email) ||
    pwd === "" ||
    repeat === "" ||
    pwd !== repeat;

  return (
    <form>
      <div className="mb-4">
        <Input
          type="email"
          placeholder="ERmail"
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
          showTooltip
        />
      </div>
      <div className="mb-4">
        <Input
          type="password"
          placeholder="Repita a Senha"
          value={repeat}
          handler={(e) => setRepeat(e.target.value)}
        />
      </div>
      <div className="mb-4">
        <Button
          text="Cadastrar"
          disabled={disabled()}
          handler={() => {}}
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
