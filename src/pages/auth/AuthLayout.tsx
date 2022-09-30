import { useCallback, useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Cookies from 'universal-cookie';
import LogoIcon from "../../images/LogoIcon";
import { AlertType } from "../../interfaces/types";
import { Alert, Loading, Title } from "../../components";
import Auth from "../../api/auth";
import { COOKIES } from "../../helpers";
import { ALERT, ROUTES } from '../../interfaces/enums';

const projectName = process.env.REACT_APP_TITLE || "Touch Sistemas";
const cookies = new Cookies();

export default function AuthLayout() {
  const navigate = useNavigate();
  const [image, setImage] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const [alert, setAlert] = useState<AlertType>({});
  const [loading, setLoading] = useState(false);

  const startLoading = () => {
    setLoading(true);
    setAlert({});
  };

  const stopLoading = () => {
    setLoading(false);
    setAlert({});
  };

  const setClientCookie = (email: string, sub: string, idToken: string) => {
    const encodedContent = COOKIES.Encode(JSON.stringify({ email, sub, idToken }));
    const date = new Date();
    date.setDate(date.getDate() + 365);
    cookies.set(COOKIES.NAME, encodedContent, { expires: date, path: "/" });
  };

  const signIn = async (email: string, pwd: string, remember: boolean) => {
    startLoading();
    try {
      const attributes = await Auth.SignIn(email, pwd, remember);
      setClientCookie(attributes.email, attributes.sub, attributes.idToken);
      stopLoading();
      navigate(ROUTES.HOME);
    } catch (err) {
      stopLoading();
      setAlert({
        type: ALERT.ERROR,
        text: "Desculpe, não foi possível fazer login"
      });
    }
  };

  const sendForgotPasswordCode = async (email: string) => {
    startLoading();
    try {
      await Auth.ForgotPassword(email);
      stopLoading();
      navigate(ROUTES.REDEFINEPASSWORD, {
        state: {
          email,
          alert: {
            type: ALERT.INFO,
            text: "Verifique seu e-mail"
          },
        },
      });
    } catch (err) {
      stopLoading();
      setAlert({
        type: ALERT.ERROR,
        text: "Não foi possível enviar o código, o email está correto?"
      });
    }
  };

  const redefinePassword = async (email: string, code: string, pwd: string) => {
    startLoading();
    try {
      await Auth.RedefinePassword(email, code, pwd);
      stopLoading();
      navigate(ROUTES.SIGNIN, {
        state: {
          email,
          alert: {
            type: ALERT.SUCCESS,
            text: "Senha alterada com sucesso!"
          },
        },
      });
    } catch (err) {
      stopLoading();
      setAlert({
        type: ALERT.ERROR,
        text: "Não foi possível redefinir a senha, e-mail, código para nova senha está errado!"
      });
    }
  };

  const signUp = async (email: string, pwd: string) => {
    startLoading();
    try {
      // we'll use just pt-BR for now
      await Auth.SignUp(email, pwd, 'pt-BR');
      // await Mutations.createClient(email);
      stopLoading();
      navigate(ROUTES.CONFIRMSIGNUP, {
        state: {
          email,
          alert: {
            type: ALERT.INFO,
            text: "Verifique seu e-mail"
          },
        },
      });
    } catch (err) {
      stopLoading();
      setAlert({
        type: ALERT.ERROR,
        text: "Não foi possível cadastrar, e-mail, código ou nova senha estão errados!"
      });
    }
  };

  const resendConfirmationCode = async (email: string) => {
    startLoading();
    try {
      await Auth.ResendConfirmationCode(email);
      stopLoading();
      navigate(ROUTES.CONFIRMSIGNUP, {
        state: {
          email,
          alert: {
            type: ALERT.SUCCESS,
            text: "Código reenviado, verifique seu e-mail"
          },
        },
      });
    } catch (err) {
      stopLoading();
      setAlert({
        type: ALERT.ERROR,
        text: "Não foi possível enviar o código, o email está correto?"
      });
    }
  };

  const confirmSignUp = async (email: string, code: string) => {
    startLoading();
    try {
      await Auth.ConfirmSignUp(email, code);
      stopLoading();
      navigate(ROUTES.SIGNIN, {
        state: {
          email,
          alert: {
            type: ALERT.SUCCESS,
            text: "Confirmação bem sucedida!"
          },
        },
      });
    } catch (err) {
      stopLoading();
      setAlert({
        type: ALERT.ERROR,
        text: "Não foi possível confirmar o cadastro, e-mail ou código estão errados!"
      });
    }
  };

  const loadUser = useCallback(async () => {
    setLoading(true);
    const getCookie = COOKIES.Decode(cookies.get(COOKIES.NAME));
    if (getCookie?.email && getCookie?.idToken) {
      try {
        const getUser = await Auth.GetUser();
        if (getUser.sub === getCookie.sub) navigate(ROUTES.HOME);
        setLoading(false);
      } catch (error: any) {
        setLoading(false);
      }
    }
    setLoading(false);
  }, [cookies, navigate]);

  useEffect(() => {
    loadUser();
  }, [loadUser]);
  
  return (
    <main className="h-screen mx-auto">
      {loading && <Loading />}
      <section className="container h-full fixed">
        <div className="h-full flex flex-col-reverse md:flex-row items-center justify-evenly">
          <div className="w-10/12 md:w-6/12 lg:w-4/12 md:mb-0 flex justify-center items-center">
            <img
              src={image}
              alt="auth"
              className="h-96 w-96 md:h-auto md:w-auto"
            />
          </div>
          <div className="w-10/12 md:w-5/12 lg:w-4/12">
            <div className="hidden md:flex flex-col justify-center items-center text-primary gap-2">
              <LogoIcon styles="h-28 w-28" />
              <Title
                text={projectName}
                className="text-2xl font-bold text-center mb-4 text-primary"
              />
            </div>
            <Title text={title} className="text-xl text-center mb-4" />
            <Alert type={alert?.type} text={alert?.text} />
            <Outlet
              context={{
                setAlert,
                setImage,
                setTitle,
                signIn,
                sendForgotPasswordCode,
                redefinePassword,
                signUp,
                resendConfirmationCode,
                confirmSignUp,
              }}
            />
          </div>
        </div>
      </section>
    </main>
  );
}
