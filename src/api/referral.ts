import AxiosInstance from "./index";
import { ReferralType } from '../interfaces/types';

export const getByID = async (referralID: string): Promise<ReferralType> => {
  const { data } = await AxiosInstance.get(`/referrals/byReferralID/${referralID}`);
  return data.data;
};

export const getByCode = async (code: string): Promise<ReferralType> => {
  const { data } = await AxiosInstance.get(`/referrals/byCodeID/${code}`);
  return data.data;
};

const ReferralsAPI = { getByID, getByCode };

export default ReferralsAPI;
