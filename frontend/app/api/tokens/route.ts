import { BASE_URL } from '../../utils/constants';
import { UserSignIn } from '../../types/users';
import { handleResponse } from '../commonResponse';
import { ResponseSuccess } from '../../utils/commonTypes';

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
