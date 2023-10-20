import { BASE_URL } from '../utils/constants';
import { CreateQuizDataResponse } from '../types/quizzes';
import { handleResponse } from './commonResponse';
import { ResponseSuccess } from '../utils/commonTypes';

export const createQuiz = async (
  method: string,
  formDataJson: string
): Promise<ResponseSuccess<CreateQuizDataResponse> | Error> => {
  const response = await fetch(`${BASE_URL}/quizzes/`, {
    method,
    body: formDataJson,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  const responseData = await handleResponse<CreateQuizDataResponse>(response);
  return responseData;
};
