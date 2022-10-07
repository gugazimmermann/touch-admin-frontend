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
  NEW = "/novo"
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
  MONTHLY = "MONTHLY"
}
