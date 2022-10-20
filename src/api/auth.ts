import { Auth as AmplifyAuth } from "aws-amplify";
import Cookies from "universal-cookie";
import { COOKIES } from "../helpers";
import { CognitoUserType } from "../interfaces/types";

const cookies = new Cookies();

const SignUp = async (email: string, password: string, locale: string): Promise<void> => {
  await AmplifyAuth.signUp({username: email, password, attributes: { email, locale }});
};

const ResendConfirmationCode = async (email: string): Promise<void> => {
  await AmplifyAuth.resendSignUp(email);
};

const ConfirmSignUp = async (email: string, code: string): Promise<void> => {
  await AmplifyAuth.confirmSignUp(email, code);
};

const SignIn = async (email: string, pwd: string, remember: boolean): Promise<CognitoUserType> => {
  const auth = await AmplifyAuth.signIn(email, pwd);
  if (auth.challengeName === "NEW_PASSWORD_REQUIRED") await AmplifyAuth.completeNewPassword(auth, pwd);
  if (remember) await AmplifyAuth.rememberDevice();
  else await AmplifyAuth.forgetDevice();
  return {...auth.attributes, idToken: auth.signInUserSession.idToken.jwtToken};
};

const ForgotPassword = async (email: string): Promise<void> => {
  await AmplifyAuth.forgotPassword(email);
};

const RedefinePassword = async (email: string, code: string, pwd: string): Promise<void> => {
  await AmplifyAuth.forgotPasswordSubmit(email, code, pwd);
};

const GetUser = async (): Promise<CognitoUserType> => {
  const { attributes } = await AmplifyAuth.currentAuthenticatedUser();
  return attributes;
};

const SignOut = async (): Promise<void> => {
  await AmplifyAuth.signOut({ global: true });
  cookies.remove(COOKIES.NAME);
};

const ChangeLanguage = async (locale: string): Promise<void> => {
  const user = await AmplifyAuth.currentAuthenticatedUser();
  await AmplifyAuth.updateUserAttributes(user, { locale });
};

const ChangeEmail = async (email: string): Promise<void> => {
  const user = await AmplifyAuth.currentAuthenticatedUser();
  await AmplifyAuth.updateUserAttributes(user, { email: email });
};

const ConfirmChangeEmail = async (code: string): Promise<void> => {
  await AmplifyAuth.verifyCurrentUserAttributeSubmit("email", code);
};

const ChangePassword = async (pwd: string, newPwd: string): Promise<void> => {
  const user = await AmplifyAuth.currentAuthenticatedUser();
  await AmplifyAuth.changePassword(user, pwd, newPwd);
};

const Auth = {
  SignUp,
  ResendConfirmationCode,
  ConfirmSignUp,
  SignIn,
  ForgotPassword,
  RedefinePassword,
  GetUser,
  SignOut,
  ChangeLanguage,
  ChangeEmail,
  ConfirmChangeEmail,
  ChangePassword,
};

export default Auth;
