import { GenericObject } from "./types";

export enum ROUTES {
  SIGNIN = "/",
  FORGOTPASSWORD = "/recuperar-senha",
  REDEFINEPASSWORD = "/redefinir-senha",
  SIGNUP = "/cadastrar",
  CONFIRMSIGNUP = "/confirmar-cadastro",
  HOME = "/inicial",
  PROFILE = "/perfil",
  PROFILE_ADVANCED = "/perfil/avancado",
  ALERTS = "/alertas",
  NEW = "/novo",
  EDIT = "/editar",
  EVENTS = "/eventos",
  SUBSCRIPTIONS = "/assinaturas",
  SURVEYS = "/pesquisas",
}

export const BrazilStates = [
  { value: "AC", name: "Acre" },
  { value: "AL", name: "Alagoas" },
  { value: "AP", name: "Amapá" },
  { value: "AM", name: "Amazonas" },
  { value: "BA", name: "Bahia" },
  { value: "CE", name: "Ceará" },
  { value: "DF", name: "Distrito Federal" },
  { value: "ES", name: "Espírito Santo" },
  { value: "GO", name: "Goiás" },
  { value: "MA", name: "Maranhão" },
  { value: "MT", name: "Mato Grosso" },
  { value: "MS", name: "Mato Grosso do Sul" },
  { value: "MG", name: "Minas Gerais" },
  { value: "PA", name: "Pará" },
  { value: "PB", name: "Paraíba" },
  { value: "PR", name: "Paraná" },
  { value: "PE", name: "Pernambuco" },
  { value: "PI", name: "Piauí" },
  { value: "RJ", name: "Rio de Janeiro" },
  { value: "RN", name: "Rio Grande do Norte" },
  { value: "RS", name: "Rio Grande do Sul" },
  { value: "RO", name: "Rondônia" },
  { value: "RR", name: "Roraima" },
  { value: "SC", name: "Santa Catarina" },
  { value: "SP", name: "São Paulo" },
  { value: "SE", name: "Sergipe" },
  { value: "TO", name: "Tocantins" },
];

export const BrazilWeekDays = ["D", "S", "T", "Q", "Q", "S", "S"];

export const BrazilMonths = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
];

export enum ALERT {
  ERROR = "ERROR",
  INFO = "INFO",
  WARNING = "WARNING",
  SUCCESS = "SUCCESS",
}

export enum CONTEXT {
  UPDATE_PROFILE = "UPDATE_PROFILE",
  UPDATE_ALERTS = "UPDATE_ALERTS",
}

export enum FILEERROR {
  SIZE = "size",
  TYPE = "type",
}

export enum FILETYPES {
  LOGO = "logo",
  MAP = "map",
}

export enum DOCS {
  CPF = "CPF",
  CNPJ = "CNPJ",
}

export enum MAP {
  PROFILE = "profile",
}

export enum PLANSTYPES {
  BASIC = "BASIC",
  ADVANCED = "ADVANCED",
  SUBSCRIPTION = "SUBSCRIPTION",
}

export type MapTypes = PLANSTYPES | MAP;

export enum PlansFrequency {
  SINGLE = "SINGLE",
  MONTHLY = "MONTHLY",
}

export enum SURVEYANSWER {
  SINGLE = "SINGLE",
  MULTIPLE = "MULTIPLE",
  TEXT = "TEXT",
  MULTILINE = "MULTILINE",
}

export const LANGUAGES: GenericObject = {
  BR: "pt",
  US: "en",
  ES: "es",
  FR: "fr",
  DE: "de",
  IT: "it",
  CN: "zh",
  JP: "ja",
  KR: "ko",
  RU: "ru",
}
export const LANGUAGESFLAGS: GenericObject = {
  BR: "Português",
  US: "Inglês",
  ES: "Espanhol",
  FR: "Frances",
  DE: "Alemão",
  IT: "Italiano",
  CN: "Chinês",
  JP: "Japonês",
  KR: "Coreano",
  RU: "Russo",
};
