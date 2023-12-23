'use client';

import { createContext, ReactNode, useEffect, useReducer } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import {
  BASE_CLIENT_URL,
  CREATE_USER,
  DELETE_USER,
  FETCH_ERROR,
  FETCH_IN_PROGRESS,
  GET_USER,
  TEST_USER_SIGN_IN,
  USER_SIGN_IN,
  USER_SIGN_OUT,
} from '../utils/constants';
import { createUser, deleteUser, getCurrentUser } from '../api/users';
import { signInTestAccount, signInUser, signOutUser } from '../api/auth';
import { UserState } from '../types/users';
import { userReducer } from '../reducers/user';

export interface AuthContextProps {
  createAccount: (form: HTMLFormElement, formJson: string, formData: FormData) => Promise<void>;
  deleteAccount: (isHardDelete: boolean) => Promise<void>;
  signIn: (form: HTMLFormElement, formData: FormData) => Promise<void>;
  signInTest: () => Promise<void>;
  signOut: () => Promise<void>;
  userState: UserState | null;
}

const defaultAuthContextProps = () =>
  ({
    createAccount: async () => {},
    deleteAccount: async () => {},
    signIn: async () => {},
    signInTest: async () => {},
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
  const redirectParam = useSearchParams().get('redirect');

  const redirectToTopics = (isCreateAccount?: boolean) => {
    if (isCreateAccount) {
      return router.push(`${BASE_CLIENT_URL}/topics?welcome=true`);
    }

    return redirectParam
      ? router.push(`${BASE_CLIENT_URL}/${redirectParam}`)
      : router.push(`${BASE_CLIENT_URL}/topics`);
  };

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
      // Make sure to cleanup after fetching
      // https://react.dev/learn/synchronizing-with-effects#fetching-data
      let ignore = false;
      const checkUser = async () => {
        userDispatch({ type: FETCH_IN_PROGRESS, isLoading: true });
        try {
          const response = await getCurrentUser();
          if (!(response instanceof Error) && !ignore) {
            userDispatch({
              error: undefined,
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

      return () => {
        ignore = true;
      };
    }
  }, [path]);

  const createAccount = async (
    form: HTMLFormElement,
    formJson: string,
    formData: FormData
  ): Promise<void> => {
    userDispatch({ type: FETCH_IN_PROGRESS, isLoading: true });
    try {
      const response = await createUser(form.method, formJson);
      if (!(response instanceof Error)) {
        userDispatch({
          error: undefined,
          isLoading: false,
          payload: response.data,
          status: response.status,
          type: CREATE_USER,
        });
        await signIn(form, formData, true);
      }
    } catch (error: any) {
      dispatchErrorHelper('There was a problem creating a user account: ', error);
    }
  };

  const signIn = async (
    form: HTMLFormElement,
    formData: FormData,
    isCreateAccount: boolean = false
  ): Promise<void> => {
    userDispatch({ type: FETCH_IN_PROGRESS, isLoading: true });
    try {
      const response = await signInUser(form.method, formData);
      if (!(response instanceof Error) && response?.data?.id) {
        userDispatch({
          error: undefined,
          isLoading: false,
          payload: response.data,
          status: response.status,
          type: USER_SIGN_IN,
        });
        redirectToTopics(isCreateAccount);
      }
    } catch (error: any) {
      dispatchErrorHelper('There was a problem signing in: ', error);
    }
  };

  const signInTest = async () => {
    userDispatch({ type: FETCH_IN_PROGRESS, isLoading: true });
    try {
      const response = await signInTestAccount();
      if (!(response instanceof Error)) {
        userDispatch({
          error: undefined,
          isLoading: false,
          payload: response.data,
          status: response.status,
          type: TEST_USER_SIGN_IN,
        });
        redirectToTopics();
      }
    } catch (error: any) {
      dispatchErrorHelper('There was a problem signing in with the shared test account: ', error);
    }
  };

  const deleteAccount = async (isHardDelete: boolean): Promise<void> => {
    userDispatch({ type: FETCH_IN_PROGRESS, isLoading: true });
    try {
      const response = await deleteUser(isHardDelete);
      if (!(response instanceof Error)) {
        userDispatch({
          error: undefined,
          isLoading: false,
          payload: response.data,
          status: response.status,
          type: DELETE_USER,
        });
        sessionStorage.setItem('quizapp-delete-account', response.data.message);
        await signOut();
      }
    } catch (error: any) {
      dispatchErrorHelper(
        `There was a problem signing out with user id: ${userState?.data?.id}`,
        error
      );
    }
  };

  const signOut = async (): Promise<void> => {
    userDispatch({ type: FETCH_IN_PROGRESS, isLoading: true });
    try {
      const response = await signOutUser();
      if (!(response instanceof Error) && typeof response?.data?.id === 'undefined') {
        userDispatch({
          error: undefined,
          isLoading: false,
          payload: response.data,
          status: response.status,
          type: USER_SIGN_OUT,
        });
        router.push('/');
      }
    } catch (error: any) {
      dispatchErrorHelper(
        `There was a problem signing out with user id: ${userState?.data?.id}`,
        error
      );
    }
  };

  return (
    <AuthContext.Provider
      value={{
        createAccount,
        deleteAccount,
        signIn,
        signOut,
        signInTest,
        userState,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
