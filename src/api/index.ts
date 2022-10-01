import axios from "axios";
import Cookies from 'universal-cookie';
import { COOKIES } from "../helpers";

const API_URL = process.env.REACT_APP_API_URL || "";
const cookies = new Cookies();
const getCookie = COOKIES.Decode(cookies.get(COOKIES.NAME));

// TODO: handle renew session
const AxiosInstance = axios.create({
  baseURL: API_URL,
  headers:{
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${getCookie?.idToken}`
    }
  })

export default AxiosInstance;
