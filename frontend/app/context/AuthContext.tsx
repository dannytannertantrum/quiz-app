'use client';

import { createContext, ReactNode, useEffect, useReducer } from 'react';
import { usePathname } from 'next/navigation';

import {
  CREATE_USER,
  FETCH_ERROR,
  FETCH_IN_PROGRESS,
  GET_USER,
  USER_SIGN_IN,
} from '../utils/constants';
import { createUser, getCurrentUser } from '../api/users/route';
import { signInUser } from '../api/tokens/route';
import { UserState } from '../types/users';
import { userReducer } from '../reducers/user';

interface AuthContextProps {
  createAccount: (form: HTMLFormElement, formJson: string) => void;
  signIn: (form: HTMLFormElement, formData: FormData) => void;
  userState: UserState | null;
}

const defaultAuthContextProps = () =>
  ({
    createAccount: () => {},
    signIn: () => {},
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

  const signIn = async (form: HTMLFormElement, formData: FormData) => {
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

        // Redirect
      }
    } catch (error: any) {
      dispatchErrorHelper('There was a problem signing in: ', error);
    }
  };

  const createAccount = async (form: HTMLFormElement, formJson: string) => {
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

        // Redirect
      }
    } catch (error: any) {
      dispatchErrorHelper('There was a problem creating a user account: ', error);
    }
  };

  return (
    <AuthContext.Provider value={{ createAccount, signIn, userState }}>
      {children}
    </AuthContext.Provider>
  );
};
