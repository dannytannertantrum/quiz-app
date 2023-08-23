export interface BaseUserData {
  email: string;
}

export interface CreateUserData extends BaseUserData {
  id: string;
  hashed_password: string;
}

export interface UserState {
  isLoading: boolean;
  error?: Error;
  data?: CreateUserData;
  status?: number;
  statusText?: string;
}
