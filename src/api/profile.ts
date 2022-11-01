import Cookies from 'universal-cookie';
import { COOKIES } from '../helpers';
import { ProfileType, OwnersType, UUID } from '../interfaces/types';
import AxiosInstance from "./index";

const cookies = new Cookies();
const getCookie = COOKIES.Decode(cookies.get(COOKIES.NAME));

export const get = async (sub?: UUID): Promise<ProfileType> => {
  const profileID = !sub ? getCookie.sub : sub;
  try {
    const { data } = await AxiosInstance.get(`/profiles/${profileID}`);
    return data.data;
  } catch (err) {
    return {} as ProfileType;
  }
};

export const post = async (sub: UUID, email: string): Promise<ProfileType> => {
  try {
    const { data } = await AxiosInstance.post("/profiles", { profileID: sub, email });
    return data.data;
  } catch (err) {
    return {} as ProfileType;
  }
}

export const update = async (profile: ProfileType): Promise<ProfileType> => {
  const { data } = await AxiosInstance.put("/profiles", profile);
  return data.data;
}

export const logoAndMapPatch = async (logo: string, map: string): Promise<ProfileType> => {
  const { data } = await AxiosInstance.patch(`/profiles/${getCookie.sub}/logomap`, { logo, map });
  return data.data;
}

export const ownerPatch = async (owner: OwnersType): Promise<OwnersType> => {
  const { data } = await AxiosInstance.patch(`/profiles/${getCookie.sub}/owners`, owner);
  return data.data;
}

export const ownerDelete = async (ownerID: UUID): Promise<OwnersType> => {
  const { data } = await AxiosInstance.patch(`/profiles/${getCookie.sub}/owners/${ownerID}`);
  return data.data;
}

export const emailPatch = async (email: string): Promise<ProfileType> => {
  const { data } = await AxiosInstance.patch(`/profiles/${getCookie.sub}`, { email });
  return data.data;
}

const ProfileAPI = { get, post, update, logoAndMapPatch, ownerPatch, ownerDelete, emailPatch };

export default ProfileAPI;
