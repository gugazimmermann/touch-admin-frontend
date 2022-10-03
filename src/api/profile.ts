import Cookies from 'universal-cookie';
import { COOKIES } from '../helpers';
import { ProfileType, OwnersType } from '../interfaces/types';
import AxiosInstance from "./index";

const cookies = new Cookies();
const getCookie = COOKIES.Decode(cookies.get(COOKIES.NAME));

export const get = async (): Promise<ProfileType> => {
  const { data } = await AxiosInstance.get(`/profiles/${getCookie.sub}`);
  return data.data;
};

export const post =async (): Promise<ProfileType> => {
  const { data } = await AxiosInstance.post("/profiles", {
    profileID: getCookie.sub,
    email: getCookie.email
  });
  return data.data;
}

export const update =async (profile: ProfileType): Promise<ProfileType> => {
  const { data } = await AxiosInstance.put("/profiles", profile);
  return data.data;
}

export const ownerPatch =async (owner: OwnersType): Promise<OwnersType> => {
  const { data } = await AxiosInstance.patch(`/profiles/${getCookie.sub}/owners`, owner);
  return data.data;
}

const ProfileAPI = { get, post, update, ownerPatch };

export default ProfileAPI;
