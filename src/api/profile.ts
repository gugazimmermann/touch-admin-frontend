import AxiosInstance from './index';

export const getAll = async () => {
  const { data } = await AxiosInstance.get("profiles");
 return data
}

const ProfileAPI = { getAll };

export default ProfileAPI;