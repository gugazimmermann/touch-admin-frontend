import Cookies from 'universal-cookie';
import { COOKIES } from '../helpers';
import { UUID, SurveyType, SurveyPostType } from '../interfaces/types';
import AxiosInstance from "./index";

const cookies = new Cookies();
const getCookie = COOKIES.Decode(cookies.get(COOKIES.NAME));

export const getByEnvetID = async (eventID: UUID): Promise<SurveyPostType[]> => {
  const { data } = await AxiosInstance.get(`/surveys/byEventID/${eventID}`);
  return data.data;
};

export const getByProfileID = async (): Promise<SurveyType[]> => {
  const { data } = await AxiosInstance.get(`/surveys/byProfileID/${getCookie.sub}`);
  return data.data;
};

export const getBySurveyID = async (surveyID: UUID): Promise<SurveyPostType> => {
  const { data } = await AxiosInstance.get(`/surveys/${surveyID}`);
  return data.data;
};

export const post = async (survey: SurveyPostType): Promise<SurveyType> => {
  const { data } = await AxiosInstance.post("/surveys", survey);
  return data.data;
}

const SurveysAPI = { getByEnvetID, getBySurveyID, post };

export default SurveysAPI;
