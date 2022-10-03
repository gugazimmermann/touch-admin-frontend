import axios from 'axios';
import { PlansTypes } from "../interfaces/enums";
import { CreateMapType } from "../interfaces/types";

const API_KEY = process.env.REACT_APP_API_KEY || "";

export async function createMap({ type, id, name, street, number, city, state, zipCode }: CreateMapType): Promise<File> {
	const color = type === PlansTypes.SUBSCRIPTION ? '0xa855f7' : (type === PlansTypes.BASIC || type === PlansTypes.ADVANCED) ? '0x10b981' : '0xf59e0b';
	const address = encodeURIComponent(`${street}, ${number} - ${city} - ${state}, ${zipCode}`);
	const marker = `markers=color:${color}%7Clabel:${name}%7C${address}`;
	const url = `https://maps.googleapis.com/maps/api/staticmap?center=${address}&zoom=17&size=1280x1280&scale=2&${marker}&key=${API_KEY}`;
	const res = await axios.get(url, { responseType: 'blob' });
	const blob = new Blob([res.data])
	const file = new File([blob], `${id}.png`, { type: blob.type });
	return file;
}
