import { ProfileType, UUID } from "../interfaces/types";
import { PaymentDataType } from "../mercadopago/types";
import AxiosInstance from "./index";

export const clientPost = async (profileID: UUID): Promise<ProfileType> => {
  const { data } = await AxiosInstance.post("/mercadopago/client", { profileID });
  return data.data;
}

export const paymentPost = async (paymentDataType: PaymentDataType): Promise<ProfileType> => {
  const { data } = await AxiosInstance.post("/mercadopago/payment", paymentDataType);
  return data.data;
}

const MercadoPagoAPI = { clientPost, paymentPost };

export default MercadoPagoAPI;
