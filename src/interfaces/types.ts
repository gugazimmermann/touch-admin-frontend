import { ALERT } from "./enums";

export type AlertType = {
  type?: ALERT;
  text?: string;
};

export type useOutletContextProps = {
  setAlert: (alert: AlertType) => void;
  setImage: (text: string) => void;
  setTitle: (text: string) => void;
};

export type LocationType = {
  state: {
    email?: string;
    alert?: AlertType;
  }
};