export interface isSuccess {
  isSuccess: boolean;
}

export interface ResponseSuccess<T> {
  data: T;
  status: number;
}

export interface ActionData<T> {
  isLoading: boolean;
  payload: T;
  status: number;
}

export type BaseActions =
  | { type: 'FETCH_ERROR'; isLoading: boolean; error: Error }
  | { type: 'FETCH_IN_PROGRESS'; isLoading: boolean }
  | { type: 'FETCH_UNKNOWN_ERROR'; isLoading: boolean };
