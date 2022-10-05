import AxiosInstance from "./index";
import { PlanType } from '../interfaces/types';

export const get = async (): Promise<PlanType[]> => {
  const { data } = await AxiosInstance.get('/plans');
  return data.data;
};

const PlansAPI = { get };

export default PlansAPI;
