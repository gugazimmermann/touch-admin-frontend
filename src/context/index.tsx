import { Dispatch, createContext, ReactNode, ReactElement, useReducer } from "react";
import LocalStorage from "../api/local-storage";
import { ContextActions, ContextStateType } from "../interfaces/context";
import { ContextReducer } from "./reducers";
import { AlertType, PlanType, ProfileType } from '../interfaces/types';

const initial: ContextStateType = {
  profile: LocalStorage.GetItem("state", true)?.client || {} as ProfileType,
  plans: LocalStorage.GetItem("state", true)?.plans || [] as PlanType[],
  alerts: [] as AlertType[],
  info: [] as AlertType[],
};

type AppContextType = {
  state: ContextStateType;
  dispatch: Dispatch<ContextActions>;
};

const AppContext = createContext<AppContextType>({
  state: initial,
  dispatch: () => null,
});

const mainReducer = (state: ContextStateType, action: ContextActions) =>
  ContextReducer(state, action);

const AppProvider = ({ children }: { children: ReactNode }): ReactElement => {
  const [state, dispatch] = useReducer(mainReducer, initial);
  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};

export { AppProvider, AppContext };
