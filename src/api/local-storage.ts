import CryptoJS from 'crypto-js';
import { GenericObject } from '../interfaces/types';

const ls = process.env.REACT_APP_LOCALSTORAGE || "touch_sistemas";
const secret = process.env.REACT_APP_CRYPTO_SECRECT || "123";

const encode = (data: string): string => CryptoJS.AES.encrypt(data, secret).toString();

const decode = (data: string): string => (CryptoJS.AES.decrypt(data, secret)).toString(CryptoJS.enc.Utf8);

const Get = (): GenericObject => {
  let storage = {};
  const getStorage = localStorage.getItem(ls);
  if (getStorage) storage = JSON.parse(getStorage);
  return storage;
}

const GetItem = (name: string, crypto?: boolean): GenericObject | null => {
  const storage = Get();
  const storageKey = Object.keys(storage).find((x: string) => x === name);
  if (!storageKey) return null;
  const objToReturn = crypto ? JSON.parse(decode(storage[storageKey])) : storage[storageKey];
  return objToReturn;
}

const Save = (name: string, obj: GenericObject | GenericObject[], cryto?: boolean): void => {
  const storage = Get();
  const objToSave = cryto ? encode(JSON.stringify(obj)) : JSON.stringify(obj);
  storage[name] = objToSave
  localStorage.setItem(ls, JSON.stringify({ ...storage }))
}

const LocalStorage = { Save, GetItem }

export default LocalStorage;
