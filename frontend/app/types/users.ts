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

export interface DeleteUser extends BaseUserData {
  created_at?: undefined;
  id: string;
  message: string;
}

export interface UserSignIn extends CurrentUser {}

export interface UserSignOut {
  id: undefined;
  email: undefined;
}

export interface UserState {
  isLoading: boolean;
  error?: Error;
  data?: CreateUserData | CurrentUser | DeleteUser | UserSignIn;
  status?: number;
  statusText?: string;
}
