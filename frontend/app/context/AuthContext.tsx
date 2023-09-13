'use client';

import { createContext, ReactNode, useEffect, useReducer } from 'react';
import { usePathname, useRouter } from 'next/navigation';

import {
  CREATE_USER,
  FETCH_ERROR,
  FETCH_IN_PROGRESS,
  GET_USER,
  USER_SIGN_IN,
  USER_SIGN_OUT,
} from '../utils/constants';
import { createUser, getCurrentUser } from '../api/users/route';
import { signInUser, signOutUser } from '../api/tokens/route';
import { UserState } from '../types/users';
import { userReducer } from '../reducers/user';
import { isSuccess } from '../utils/commonTypes';

export interface AuthContextProps {
  createAccount: (form: HTMLFormElement, formJson: string) => Promise<isSuccess>;
  signIn: (form: HTMLFormElement, formData: FormData) => Promise<isSuccess>;
  signOut: () => Promise<void>;
  userState: UserState | null;
}

const defaultAuthContextProps = () =>
  ({
    createAccount: async () => ({ isSuccess: false }),
    signIn: async () => ({ isSuccess: false }),
    signOut: async () => {},
    userState: null,
  } satisfies AuthContextProps);

const initialUserState = () =>
  ({
    error: undefined,
    isLoading: false,
    data: undefined,
    status: undefined,
    statusText: undefined,
  } satisfies UserState);

export const AuthContext = createContext<AuthContextProps>(defaultAuthContextProps());

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [userState, userDispatch] = useReducer(userReducer, initialUserState());
  const path = usePathname();
  const router = useRouter();

  const dispatchErrorHelper = (message: string, error: any): void => {
    userDispatch({
      type: FETCH_ERROR,
      isLoading: false,
      error,
    });
    console.error(message, error);
  };

  useEffect(() => {
    if (path !== '/') {
      const checkUser = async () => {
        userDispatch({ type: FETCH_IN_PROGRESS, isLoading: true });
        try {
          const response = await getCurrentUser();
          if (!(response instanceof Error)) {
            userDispatch({
              type: GET_USER,
              isLoading: false,
              payload: response.data,
              status: response.status,
            });
          }
        } catch (error: any) {
          dispatchErrorHelper('There was a problem getting the current user: ', error);
        }
      };
      checkUser();
    }
  }, [path]);

  const signIn = async (form: HTMLFormElement, formData: FormData): Promise<isSuccess> => {
    userDispatch({ type: FETCH_IN_PROGRESS, isLoading: true });
    try {
      const response = await signInUser(form.method, formData);
      if (!(response instanceof Error)) {
        userDispatch({
          type: USER_SIGN_IN,
          isLoading: false,
          payload: response.data,
          status: response.status,
        });
      }
      return { isSuccess: true };
    } catch (error: any) {
      dispatchErrorHelper('There was a problem signing in: ', error);
      return { isSuccess: false };
    }
  };

  const signOut = async (): Promise<void> => {
    userDispatch({ type: FETCH_IN_PROGRESS, isLoading: true });
    try {
      const response = await signOutUser();
      if (!(response instanceof Error)) {
        userDispatch({
          type: USER_SIGN_OUT,
          isLoading: false,
          payload: response.data,
          status: response.status,
        });
      }
      router.push('/');
    } catch (error: any) {
      dispatchErrorHelper(
        `There was a problem signing out with user id: ${userState?.data?.id}`,
        error
      );
    }
  };

  const createAccount = async (form: HTMLFormElement, formJson: string): Promise<isSuccess> => {
    userDispatch({ type: FETCH_IN_PROGRESS, isLoading: true });
    try {
      const response = await createUser(form.method, formJson);
      if (!(response instanceof Error)) {
        userDispatch({
          type: CREATE_USER,
          isLoading: false,
          payload: response.data,
          status: response.status,
        });
      }
      return { isSuccess: true };
    } catch (error: any) {
      dispatchErrorHelper('There was a problem creating a user account: ', error);
      return { isSuccess: false };
    }
  };

  return (
    <AuthContext.Provider value={{ createAccount, signIn, signOut, userState }}>
      {children}
    </AuthContext.Provider>
  );
};
