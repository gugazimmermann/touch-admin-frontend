import axios from "axios";
import Cookies from 'universal-cookie';
import Auth from "./auth";
import { COOKIES } from "../helpers";

const API_URL = process.env.REACT_APP_API_URL || "";
const cookies = new Cookies();
const getCookie = COOKIES.Decode(cookies.get(COOKIES.NAME));

const AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${getCookie?.idToken}`
  }
})

const axiosErrorHandler = async (error: any): Promise<any> => {
  if (error.message === 'Network Error') {
    await Auth.SignOut();
    return;
  }
  throw error;
};

AxiosInstance.interceptors.response.use((res) => res, axiosErrorHandler);

export default AxiosInstance;
