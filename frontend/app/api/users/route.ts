import { BASE_URL } from '../../utils/constants';
import { CreateUserData } from '../../types/users';
import { handleResponse } from '../commonResponse';
import { ResponseSuccess } from '../../utils/commonTypes';

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
