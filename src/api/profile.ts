import { ProfileType } from '../interfaces/types';
import AxiosInstance from './index';

export const post = async (profile: ProfileType) => {
  const { data } = await AxiosInstance.post("profiles", profile);
  console.log(data);
 return data
}

export const getAll = async () => {
  const { data } = await AxiosInstance.get("profiles");
 return data
}

const ProfileAPI = { post, getAll };

export default ProfileAPI;