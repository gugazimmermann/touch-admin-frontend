import Cookies from 'universal-cookie';
import { COOKIES } from '../helpers';
import { UUID, SurveyType } from '../interfaces/types';
import AxiosInstance from "./index";

const cookies = new Cookies();
const getCookie = COOKIES.Decode(cookies.get(COOKIES.NAME));

export const getByEnvetID = async (eventID: UUID): Promise<SurveyType[]> => {
  const { data } = await AxiosInstance.get(`/surveys/byEventID/${eventID}`);
  return data.data;
};

export const getByProfileID = async (): Promise<SurveyType[]> => {
  const { data } = await AxiosInstance.get(`/surveys/byProfileID/${getCookie.sub}`);
  return data.data;
};

export const getBySurveyID = async (surveyID: UUID): Promise<SurveyType> => {
  const { data } = await AxiosInstance.get(`/surveys/${surveyID}`);
  return data.data;
};

export const post = async (survey: SurveyType): Promise<SurveyType> => {
  const { data } = await AxiosInstance.post("/surveys", survey);
  return data.data;
}

export const translate = async (surveyID: UUID, language: string): Promise<SurveyType> => {
  const { data } = await AxiosInstance.post("/surveys/translate", { surveyID, language });
  return data.data;
}

const SurveysAPI = { getByEnvetID, getBySurveyID, post, translate };

export default SurveysAPI;
