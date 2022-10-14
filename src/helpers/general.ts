import { ContextStateType } from "../interfaces/context";
import { ALERT } from "../interfaces/enums";

export const showLink = (state: ContextStateType): boolean =>
  !state.alerts.filter((a) => a.type === ALERT.WARNING).length;

export const getObjKey = (obj: any, value: string) => Object.keys(obj).find(key => obj[key] === value)