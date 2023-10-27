import { BASE_URL } from '../utils/constants';
import { RESPONSE_ERROR } from '../utils/constants';

export const updateQuizQuestion = async (
  id: string,
  formDataJson: string
): Promise<Partial<Response> | Error> => {
  const response = await fetch(`${BASE_URL}/quiz-questions/${id}`, {
    method: 'put',
    body: formDataJson,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(RESPONSE_ERROR);
  }

  return {
    status: response.status,
  };
};
