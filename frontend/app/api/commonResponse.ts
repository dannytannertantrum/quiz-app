import { ResponseSuccess } from '../utils/commonTypes';

export const handleResponse = async <T>(
  response: Response
): Promise<ResponseSuccess<T> | Error> => {
  if (!response.ok) {
    throw new Error('Network response was not OK');
  }

  const data: T = await response.json();
  return {
    data,
    status: response.status,
  };
};
