import { useState, useEffect } from "react";
import { useLocation, useOutletContext, useSearchParams } from "react-router-dom";
import { Input, Button, Link } from "../../components";
import { validateEmail } from "../../helpers";
import { ROUTES } from "../../interfaces/enums";
import { LocationType, useOutletContextProps, AlertType } from "../../interfaces/types";
import Image from "../../images/auth/RedefinePassword.svg";

export default function RedefinePassword() {
  const location: LocationType = useLocation();
  const { setAlert, setImage, setTitle }: useOutletContextProps = useOutletContext();
  const [searchParams] = useSearchParams();
  const [email, setEmail] = useState(location.state?.email || "");
  const [code, setCode] = useState("");
  const [pwd, setPwd] = useState("");
  const [repeat, setRepeat] = useState("");

  useEffect(
    () => setAlert((location.state?.alert as AlertType) || {}),
    [location.state?.alert, setAlert]
  );
  useEffect(() => setImage(Image), [setImage]);
  useEffect(() => setTitle("Redefinir Senha"), [setTitle]);

  useEffect(() => {
    if (searchParams.get("email")) setEmail(searchParams.get("email") || "");
    if (searchParams.get("code")) setCode(searchParams.get("code") || "");
  }, [searchParams]);

  const disabled = () =>
    email === "" ||
    !validateEmail(email) ||
    code === "" ||
    code.length < 6 ||
    pwd === "" ||
    repeat === "" ||
    pwd !== repeat;

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
          text="Redefinir Senha"
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
