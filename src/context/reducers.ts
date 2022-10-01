import LocalStorage from "../api/local-storage";
import { ContextActions, ContextStateType } from "../interfaces/context";
import { CONTEXT } from "../interfaces/enums";
import { AlertType, ProfileType } from "../interfaces/types";

const saveState = (state: ContextStateType) =>
  LocalStorage.Save("state", state, true);

const updateProfile = (state: ContextStateType, payload: any) => {
  const newState = { ...state, profile: payload };
  saveState(newState);
  return newState;
};

const updateAlerts = (state: ContextStateType, payload: AlertType[]) => {
  const newState = { ...state, alerts: payload };
  saveState(newState);
  return newState;
};

export const ContextReducer = (state: ContextStateType, { type, payload }: ContextActions): ContextStateType => {
  switch (type) {
    case CONTEXT.UPDATE_PROFILE:
      return updateProfile(state, payload as ProfileType);
    case CONTEXT.UPDATE_ALERTS:
      return updateAlerts(state, payload as AlertType[]);
    default:
      throw new Error("TYPE NOT FOUND");
  }
};
