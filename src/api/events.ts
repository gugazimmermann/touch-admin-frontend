import Cookies from 'universal-cookie';
import { COOKIES } from '../helpers';
import { EventType } from '../interfaces/types';
import AxiosInstance from "./index";

const cookies = new Cookies();
const getCookie = COOKIES.Decode(cookies.get(COOKIES.NAME));

export const getByProfileID = async (): Promise<EventType[]> => {
  const { data } = await AxiosInstance.get(`/events/byProfileID/${getCookie.sub}`);
  return data.data;
};

export const post = async (event: EventType): Promise<EventType> => {
  const { data } = await AxiosInstance.post("/events", event);
  return data.data;
}

export const logoAndMapPatch = async (eventID: string, logo: string, map: string): Promise<EventType> => {
  const { data } = await AxiosInstance.patch(`/events/${eventID}/logomap`, { logo, map });
  return data.data;
}

const EventsAPI = { getByProfileID, post, logoAndMapPatch };

export default EventsAPI;
