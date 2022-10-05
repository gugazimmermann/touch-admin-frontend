import { ContextStateType } from "../interfaces/context";
import { ALERT } from "../interfaces/enums";

export const showLink = (state: ContextStateType): boolean =>
  !state.alerts.filter((a) => a.type === ALERT.WARNING)
  .length;
