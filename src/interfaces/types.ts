import { ALERT, MapTypes } from "./enums";

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

export type useOutletContextProfileProps = {
  loadClient: (force?: boolean) => void;
  setLoading: (loading?: boolean) => void;
};

export type LocationType = {
  state: {
    email?: string;
    alert?: AlertType;
  }
};

export type CognitoUserType = {
  sub: string;
  email_verified?: boolean;
  locale: string;
  email: string;
  idToken: string;
};

export type GenericObject = { [key: string]: any };

export type OwnersType = {
  name: string;
  email: string;
  phone: string;
  createdAt?: string;
  updatedAt?: string;
}

export type ProfileType = {
  profileID: string;
  email: string;
  phone?: string;
  name?: string;
  documenttype?: string;
  document?: string;
  zipCode?: string;
  state?: string;
  city?: string;
  district?: string;
  street?: string;
  number?: string;
  complement?: string;
  website?: string;
  map?: string;
  logo?: string;
  owners?: OwnersType[];
  createdAt?: string;
  updatedAt?: string;
}

export type AddressFromCEPType = {
  state: string;
  street: string;
  city: string;
}

export type CreateMapType = {
	type: MapTypes;
	id: string;
	name: string;
	street: string;
	number: string;
	city: string;
	state: string;
	zipCode: string;
}