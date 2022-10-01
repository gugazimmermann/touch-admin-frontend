import { CONTEXT } from "./enums";
import { AlertType, ProfileType } from "./types";

type ContextPayload = {
  [CONTEXT.UPDATE_PROFILE]: ProfileType;
  [CONTEXT.UPDATE_ALERTS]: AlertType[];
};

export type ContextActions =
  ContextActionMap<ContextPayload>[keyof ContextActionMap<ContextPayload>];

export type ContextActionMap<M extends { [index: string]: unknown }> = {
  [Key in keyof M]: M[Key] extends undefined
    ? {
        type: Key;
      }
    : {
        type: Key;
        payload: M[Key];
      };
};

export type ContextStateType = {
  profile: ProfileType;
  alerts: AlertType[];
  info: AlertType[];
};

