import {
  CREATE_USER,
  FETCH_ERROR,
  FETCH_IN_PROGRESS,
  FETCH_UNKNOWN_ERROR,
  GET_USER,
  USER_SIGN_IN,
  USER_SIGN_OUT,
} from '../utils/constants';
import { ActionData, BaseActions } from '../utils/commonTypes';
import { CreateUserData, CurrentUser, UserSignIn, UserSignOut, UserState } from '../types/users';

interface CreateUserAction extends ActionData<CreateUserData> {
  type: 'CREATE_USER';
}
interface GetUserAction extends ActionData<CurrentUser> {
  type: 'GET_USER';
}
interface UserSignInAction extends ActionData<UserSignIn> {
  type: 'USER_SIGN_IN';
}
interface UserSignOutAction extends ActionData<UserSignOut> {
  type: 'USER_SIGN_OUT';
}

export const userReducer = (
  state: UserState,
  action: BaseActions | CreateUserAction | GetUserAction | UserSignInAction | UserSignOutAction
): UserState => {
  switch (action.type) {
    case FETCH_ERROR:
      return {
        ...state,
        isLoading: false,
        error: action.error,
      };
    case FETCH_IN_PROGRESS:
      return { ...state, isLoading: true };
    case CREATE_USER:
    case GET_USER:
    case USER_SIGN_IN:
      return {
        ...state,
        error: undefined,
        isLoading: false,
        data: action.payload,
        status: action.status,
      };
    case USER_SIGN_OUT:
      return {
        ...state,
        error: undefined,
        isLoading: false,
        data: undefined,
        status: action.status,
      };
    case FETCH_UNKNOWN_ERROR:
      return { ...state, isLoading: false };

    default:
      throw new Error(`Unknown action type: ${action}`);
  }
};
