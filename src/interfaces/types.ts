import { ALERT } from "./enums";

export type AlertType = {
  type?: ALERT;
  text?: string;
};

export type useOutletContextProps = {
  setAlert: (alert: AlertType) => void;
  setImage: (text: string) => void;
  setTitle: (text: string) => void;
  signIn: (email: string, pwd: string, remember: boolean) => void;
  sendForgotPasswordCode: (email: string) => void;
  redefinePassword: (email: string, code: string, pwd: string) => void;
  resendConfirmationCode: (email: string) => void;
  confirmSignUp: (email: string, code: string) => void;
  signUp: (email: string, pwd: string) => void;
};

export type LocationType = {
  state: {
    email?: string;
    alert?: AlertType;
  }
};

export type CognitoUserType = {
  sub: string;
  email_verified: boolean;
  locale: string;
  email: string;
};

export type GenericObject = { [key: string]: any };