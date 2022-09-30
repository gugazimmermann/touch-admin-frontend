import CryptoJS from 'crypto-js';
import { GenericObject } from '../interfaces/types';

const cryptoSecret = process.env.REACT_APP_CRYPTO_SECRECT || '123'

const Encode = (data: string): string => CryptoJS.AES.encrypt(data, cryptoSecret).toString();

const Decode = (data: string): GenericObject | null => {
	if (data) {
		const decryptedBytes = CryptoJS.AES.decrypt(data, cryptoSecret);
		return JSON.parse(decryptedBytes.toString(CryptoJS.enc.Utf8));
	}
	return null;
}

const NAME = process.env.REACT_APP_LOCALSTORAGE || 'touch_sistemas';

const COOKIES = { Encode, Decode, NAME };

export default COOKIES;
