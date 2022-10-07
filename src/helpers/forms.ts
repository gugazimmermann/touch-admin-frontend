import { DOCS, FILEERROR } from "../interfaces/enums";
import { AddressFromCEPType } from "../interfaces/types";

export const validateEmail = (email: string) => {
  const re =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

export const getAddressFromCEP = async (
  zipCode: string
): Promise<AddressFromCEPType | null> => {
  let cleanCep = "";
  if (zipCode.length > 1) cleanCep = zipCode.replace(/\D/g, "");
  if (cleanCep.length === 8) {
    const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
    const data = await response.json();
    if (!data?.erro) {
      return {
        state: data.uf,
        street: data.logradouro,
        city: data.localidade,
      };
    }
    throw new Error(`CEP não encontrado.`);
  }
  return null;
}

export const validateFile =(files: FileList): FILEERROR | File | null => {
  if (files && files.length) {
    const file = files[0];
    if (file.size > 2 * 1024 * 1024) return FILEERROR.SIZE;
    if (!["image/png", "image/jpeg"].includes(file.type)) return FILEERROR.TYPE;
    if (!["jpg", "jpeg", "png"].includes(file.name.split(".").pop() || ""))
      return FILEERROR.TYPE;
    return file;
  }
  return null;
}

export const normalizePhone = (phone: string | null | undefined, show?: boolean): string => {
  if (!phone) return "";
  const currentValue = !show
    ? phone.replace(/[^\d]/g, "")
    : phone.replace(/[^\d]/g, "").slice(2);
  const cvLength = currentValue.length;
  if (cvLength < 3) return currentValue;
  if (cvLength < 6)
    return `(${currentValue.slice(0, 2)}) ${currentValue.slice(2)}`;
  if (cvLength < 11)
    return `(${currentValue.slice(0, 2)}) ${currentValue.slice(
      2,
      6
    )}-${currentValue.slice(6, 10)}`;
  return `(${currentValue.slice(0, 2)}) ${currentValue.slice(
    2,
    7
  )}-${currentValue.slice(7, 11)}`;
}

export const normalizeCPF = (value: string): string => {
  const cvLength = value.length;
  if (cvLength < 3) return value;
  if (cvLength < 6) return `${value.slice(0, 3)}.${value.slice(3)}`;
  if (cvLength < 9)
    return `${value.slice(0, 3)}.${value.slice(3, 6)}.${value.slice(6)}`;
  return `${value.slice(0, 3)}.${value.slice(3, 6)}.${value.slice(
    6,
    9
  )}-${value.slice(9, 11)}`;
}

export const normalizeCNPJ = (value: string): string => {
  const cvLength = value.length;
  if (cvLength < 3) return value;
  if (cvLength < 5) return `${value.slice(0, 2)}.${value.slice(2)}`;
  if (cvLength < 8)
    return `${value.slice(0, 2)}.${value.slice(2, 5)}.${value.slice(5)}`;
  if (cvLength < 12)
    return `${value.slice(0, 2)}.${value.slice(2, 5)}.${value.slice(
      5,
      8
    )}/${value.slice(8, 12)}`;
  return `${value.slice(0, 2)}.${value.slice(2, 5)}.${value.slice(
    5,
    8
  )}/${value.slice(8, 12)}-${value.slice(12, 14)}`;
}

export const normalizeDocument = (type: DOCS, document: string): string => {
  if (!type || !document) return "";
  const currentValue = document.replace(/[^\d]/g, "");
  const doc =
    type === DOCS.CPF
      ? normalizeCPF(currentValue)
      : normalizeCNPJ(currentValue);
  return doc;
}

export const normalizeCEP = (cep: string): string => {
  if (!cep) return "";
  const currentValue = cep.replace(/[^\d]/g, "");
  const cvLength = currentValue.length;
  if (cvLength < 3) return currentValue;
  if (cvLength < 7)
    return `${currentValue.slice(0, 2)}.${currentValue.slice(2)}`;
  return `${currentValue.slice(0, 2)}.${currentValue.slice(
    2,
    5
  )}-${currentValue.slice(5, 8)}`;
}

export const normalizeWebsite = (w: string): string => {
  if (!w) return "";
  if (w.charAt(0).toLocaleLowerCase() !== "h") w = `http://${w}`;
  if (w.charAt(w.length - 1) === "/") w = w.slice(0, -1);
  return w;
}