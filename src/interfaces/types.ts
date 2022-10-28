import { ReactElement } from "react";
import {
  ALERT,
  FILETYPES,
  MapTypes,
  PlansFrequency,
  PLANSTYPES,
  SURVEYANSWER,
} from "./enums";

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

export type AlertType = {
  type: ALERT | undefined;
  text: string | undefined;
};

export type LocationType = {
  state: {
    email?: string;
    alert?: AlertType;
  };
};

export type CognitoUserType = {
  sub: string;
  email_verified?: boolean;
  locale: string;
  email: string;
  idToken: string;
};

export type GenericObject = { [key: string]: any };

export type UUID = string;

interface IDBDates {
  createdAt?: string;
  updatedAt?: string;
}

export interface IMercadoPagoClient {
  id?: string;
  email?: string;
  first_name?: string;
  last_name?: string;
  identification?: {
    type?: string;
    number?: string;
  };
  phone?: {
    area_code?: string;
    number?: string;
  };
  address?: {
    id?: string;
    zip_code?: string;
    street_name?: string;
    street_number?: number;
    city?: string;
  };
  addresses?: string[];
  cards?: string[];
  date_created?: string;
  date_last_updated?: string;
  date_registered?: string;
  default_address?: string;
  default_card?: string;
  description?: string;
  live_mode?: string;
  metadata?: {
    source_sync?: string;
  };
}

export interface IContacts {
  email?: string;
  phone?: string;
  website?: string;
}

interface IAddress {
  zipCode?: string;
  state?: string;
  city?: string;
  district?: string;
  street?: string;
  number?: string;
  complement?: string;
}

export interface OwnersType extends IDBDates, IContacts {
  ownerID?: UUID;
  name?: string;
}

export interface ProfileType extends IDBDates, IAddress, IContacts {
  profileID: UUID;
  name?: string;
  documenttype?: string;
  document?: string;
  map?: string;
  logo?: string;
  owners?: OwnersType[];
  mercadopago?: IMercadoPagoClient;
}

export type AddressFromCEPType = {
  state: string;
  street: string;
  city: string;
};

export interface CreateMapType extends IAddress {
  type: MapTypes;
  id: string;
  name: string;
}

export type SendPublicFileType = {
  type: FILETYPES;
  id: string;
  file: File;
  setProgress: (progress: number) => void;
};

export type PlanType = {
  planID: UUID;
  name: string;
  type: PLANSTYPES;
  frequency: PlansFrequency;
  detail: string[];
  price: number;
};

export type PlansCardInfoType = {
  color: string;
  icon: ReactElement;
};

export type PlansModalType = {
  plan: PlanType;
  info: PlansCardInfoType;
};

export interface ReferralType extends IDBDates, IAddress, IContacts {
  referralID: UUID;
  code: string;
  company: string;
  contact: string;
}

export interface EventType extends IDBDates, IAddress, IContacts {
  eventID?: UUID;
  profileID?: UUID;
  planType?: PLANSTYPES;
  plan?: PlanType;
  "profileID#PlanType"?: string;
  name: string;
  dates: string[];
  referralCode?: string;
  referral?: ReferralType;
  method: string;
  gift: string | number;
  giftDescription?: string;
  prizeDraw: string | number;
  prizeDrawDescription?: string;
  description?: string;
  map?: string;
  logo?: string;
  payment?: {
    status: string;
  }
}

export interface SurveyAnswerType extends IDBDates {
  id: UUID;
  order: number;
  text: string;
}

export interface SurveyQuestionType extends IDBDates {
  id: UUID;
  order: number;
  text: string;
  type: SURVEYANSWER;
  required: string;
  answers: SurveyAnswerType[];
}
export interface SurveyType extends IDBDates {
  surveyID: UUID;
  profileID: UUID;
  eventID: UUID;
  language: string;
  questions: SurveyQuestionType[];
}

export type SurveySimpleType = {
  language: string;
  questions: SurveyQuestionType[];
};

export type SurveyPostType = {
  surveyID: UUID;
  profileID: UUID;
  eventID: UUID;
  surveys: SurveySimpleType[];
};
