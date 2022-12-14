import { useContext, useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import Auth from "../../api/auth";
import ProfileAPI from "../../api/profile";
import { Button, Input, Title, Alert, Form, Loading } from "../../components";
import { AppContext } from "../../context";
import { validateEmail } from "../../helpers";
import { ROUTES, ALERT } from "../../interfaces/enums";
import { useOutletContextProfileProps, AlertType } from "../../interfaces/types";

export default function Profile() {
  const { state } = useContext(AppContext);
  const { loadClient } = useOutletContext<useOutletContextProfileProps>();
  const [alert, setAlert] = useState<AlertType>({
    type: undefined,
    text: undefined,
  });
  const [loading, setLoading] = useState(false);
  const [showCode, setShowCode] = useState(false);
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");

  useEffect(() => {
    setEmail(state.profile?.email || "");
  }, [state.profile?.email]);

  const handleLoading = () => {
    setAlert({ type: undefined, text: undefined });
    setLoading(true);
  };

  const handleChangeEmail = async () => {
    handleLoading();
    try {
      await Auth.ChangeEmail(email)
      await ProfileAPI.emailPatch(email);
      setShowCode(true);
    } catch (error: any) {
      setAlert({ type: ALERT.ERROR, text: error.message });
    }
    setLoading(false);
  };

  const handleVerifyCode = async () => {
    handleLoading();
    try {
      await Auth.ConfirmChangeEmail(code);
      loadClient(true);
      setShowCode(false);
      setAlert({ type: ALERT.SUCCESS, text: "Email alterado com sucesso!" });
    } catch (error: any) {
      setAlert({ type: ALERT.ERROR, text: error.message });
    }
    setLoading(false);
  };

  const handlePassword = async () => {
    handleLoading();
    try {
      await Auth.ChangePassword(currentPassword, newPassword);
      setAlert({ type: ALERT.SUCCESS, text:"Senha alterada com sucesso!" });
    } catch (error: any) {
      setAlert({ type: ALERT.ERROR, text: error.message });
    }
    setLoading(false);
  };

  const disabledEmail = () => !email || email === state.profile?.email || !validateEmail(email);

  const disabledCode = () => !code || code.length > 6;

  const disabledPassword = () => !currentPassword || newPassword !== repeatPassword || newPassword.length < 8;

  const renderEmail = () => (
    <>
      <Input
        type="email"
        placeholder="Email"
        value={email}
        handler={(e) => setEmail(e.target.value)}
      />
      <Button
        text="Mudar Email"
        disabled={disabledEmail()}
        handler={() => handleChangeEmail()}
      />
    </>
  );

  const renderCode = () => (
    <>
      <Title
        text="Por favor, verifique seu Email e envie o c??digo."
        className="text-warning text-sm"
      />
      <Input
        type="text"
        placeholder="C??digo"
        value={code}
        handler={(e) => setCode(e.target.value)}
      />
      <Button
        text='Enviar C??digo'
        disabled={disabledCode()}
        handler={() => handleVerifyCode()}
      />
    </>
  );

  const renderChangeEmail = () => (
    <Form>
      <div className="mb-4 w-full flex flex-col gap-4 justify-center">
        {!showCode ? renderEmail() : renderCode()}
      </div>
    </Form>
  );

  const renderChangePassword = () => (
    <Form>
      <div className="mb-4 w-full flex flex-col gap-4 justify-center">
        <Input
          type="password"
          placeholder="Senha Atual"
          value={currentPassword}
          handler={(e) => setCurrentPassword(e.target.value)}
        />
        <Input
          type="password"
          placeholder="Nova Senha"
          value={newPassword}
          handler={(e) => setNewPassword(e.target.value)}
          showTooltip
        />
        <Input
          type="password"
          placeholder="Repita a Nova Senha"
          value={repeatPassword}
          handler={(e) => setRepeatPassword(e.target.value)}
        />
        <Button
          text="Mudar Senha"
          disabled={disabledPassword()}
          handler={() => handlePassword()}
        />
      </div>
    </Form>
  );

  return (
    <section>
      {loading && <Loading />}
      <Title text="Meu Perfil - Avan??ado" back={ROUTES.PROFILE} className="font-bold text-center" />
      <Alert type={alert?.type} text={alert?.text} />
      <div className="flex flex-col sm:flex-row sm:gap-4 sm:justify-around sm:items-start">
        {renderChangeEmail()}
        {renderChangePassword()}
      </div>
    </section>
  );
}
