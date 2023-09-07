export interface BaseUserData {
  email: string;
}

export interface CurrentUser extends BaseUserData {
  id: string;
}

export interface CreateUserData extends BaseUserData {
  id: string;
  hashed_password: string;
}

export interface UserSignIn extends CurrentUser {
  isAuthorized: boolean;
}

export interface UserState {
  isLoading: boolean;
  error?: Error;
  data?: CreateUserData | CurrentUser | UserSignIn;
  status?: number;
  statusText?: string;
}
