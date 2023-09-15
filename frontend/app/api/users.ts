import { BASE_URL } from '../utils/constants';
import { CreateUserData, CurrentUser } from '../types/users';
import { handleResponse } from './commonResponse';
import { ResponseSuccess } from '../utils/commonTypes';

export const createUser = async (
  method: string,
  formDataJson: string
): Promise<ResponseSuccess<CreateUserData> | Error> => {
  const response = await fetch(`${BASE_URL}/users/`, {
    method,
    body: formDataJson,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  const responseData = await handleResponse<CreateUserData>(response);
  return responseData;
};

export const getCurrentUser = async (): Promise<ResponseSuccess<CurrentUser> | Error> => {
  const response = await fetch(`${BASE_URL}/users/me`, { credentials: 'include' });

  const responseData = await handleResponse<CurrentUser>(response);
  return responseData;
};
