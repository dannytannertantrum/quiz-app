import { BASE_URL } from '../utils/constants';
import { UserSignIn, UserSignOut } from '../types/users';
import { handleResponse } from './commonResponse';
import { ResponseSuccess } from '../utils/commonTypes';

export const signInUser = async (
  method: string,
  formData: FormData
): Promise<ResponseSuccess<UserSignIn> | Error> => {
  const response = await fetch(`${BASE_URL}/auth/token`, {
    method,
    body: formData,
    credentials: 'include',
  });

  const responseData = await handleResponse<UserSignIn>(response);
  return responseData;
};

export const signOutUser = async (): Promise<ResponseSuccess<UserSignOut> | Error> => {
  const response = await fetch(`${BASE_URL}/auth/sign-out`, {
    method: 'post',
    credentials: 'include',
  });

  const responseData = await handleResponse<UserSignOut>(response);
  return responseData;
};
