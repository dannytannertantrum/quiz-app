import {
  CREATE_USER,
  FETCH_ERROR,
  FETCH_IN_PROGRESS,
  FETCH_UNKNOWN_ERROR,
} from '../utils/constants';
import { BaseActions } from '../utils/commonTypes';
import { CreateUserData, UserState } from '../types/users';

interface UserAction {
  type: 'CREATE_USER';
  isLoading: boolean;
  payload: CreateUserData;
  status: number;
}

export const userReducer = (state: UserState, action: BaseActions | UserAction): UserState => {
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
      return {
        ...state,
        isLoading: false,
        data: action.payload,
        status: action.status,
      };
    case FETCH_UNKNOWN_ERROR:
      return { ...state, isLoading: false };

    default:
      throw new Error(`Unknown action type: ${action}`);
  }
};
