import { EventType } from '../interfaces/types';
import AxiosInstance from "./index";

export const post = async (event: EventType): Promise<EventType> => {
  const { data } = await AxiosInstance.post("/events", event);
  return data.data;
}

export const logoAndMapPatch = async (eventID: string, logo: string, map: string): Promise<EventType> => {
  const { data } = await AxiosInstance.patch(`/events/${eventID}/logomap`, { logo, map });
  return data.data;
}

const EventsAPI = { post, logoAndMapPatch };

export default EventsAPI;
