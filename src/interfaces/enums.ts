export enum ROUTES {
  SIGNIN = "/",
  FORGOTPASSWORD = "/recuperar-senha",
  REDEFINEPASSWORD = "/redefinir-senha",
  SIGNUP = "/cadastrar",
  CONFIRMSIGNUP = "/confirmar-cadastro",
  HOME = "/inicial",
  PROFILE = "/perfil",
  ALERTS = "/alertas"
}

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