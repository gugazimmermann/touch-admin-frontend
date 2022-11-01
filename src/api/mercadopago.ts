import { UUID, EventType } from '../interfaces/types';
import { PaymentDataType } from "../mercadopago/types";
import AxiosInstance from "./index";

export const clientPost = async (profileID: UUID): Promise<void> => {
  await AxiosInstance.post("/mercadopago/client", { profileID });
}

export const paymentPost = async (paymentDataType: PaymentDataType): Promise<EventType> => {
  const { data } = await AxiosInstance.post("/mercadopago/payment", paymentDataType);
  return data.data;
}

const MercadoPagoAPI = { clientPost, paymentPost };

export default MercadoPagoAPI;
