import Cookies from 'universal-cookie';
import { COOKIES } from '../helpers';
import { ProfileType } from '../interfaces/types';
import AxiosInstance from "./index";

const cookies = new Cookies();
const getCookie = COOKIES.Decode(cookies.get(COOKIES.NAME));

export const getCurrentUser = async (): Promise<ProfileType> => {
  const { data } = await AxiosInstance.get("profiles/" + getCookie.sub);
  return data.data;
};

export const postCurrentUser =async (): Promise<ProfileType> => {
  const { data } = await AxiosInstance.post("profiles", {
    profileID: getCookie.sub,
    email: getCookie.email
  });
  return data.data;
}

const ProfileAPI = { getCurrentUser, postCurrentUser };

export default ProfileAPI;
