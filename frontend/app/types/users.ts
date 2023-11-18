export interface BaseUserData {
  email: string;
}

export interface CurrentUser extends BaseUserData {
  id: string;
  created_at: string;
}

export interface CreateUserData extends BaseUserData {
  id: string;
  created_at: string;
  hashed_password: string;
}

export interface UserSignIn extends CurrentUser {
  isAuthorized: boolean;
}

export interface UserSignOut {
  isAuthorized: boolean;
  id: undefined;
  email: undefined;
}

export interface UserState {
  isLoading: boolean;
  error?: Error;
  data?: CreateUserData | CurrentUser | UserSignIn;
  status?: number;
  statusText?: string;
}
