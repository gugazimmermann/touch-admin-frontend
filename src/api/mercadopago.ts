import { EventType } from '../interfaces/types';
import { PaymentDataType } from "../mercadopago/types";
import AxiosInstance from "./index";

export const paymentPost = async (paymentDataType: PaymentDataType): Promise<EventType> => {
  try {
    const { data } = await AxiosInstance.post("/mercadopago/payment", paymentDataType);
    return data.data;
  } catch (error) {
    return {} as EventType;
  }
}

const MercadoPagoAPI = { paymentPost };

export default MercadoPagoAPI;
