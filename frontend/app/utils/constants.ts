// With Docker, we need to configure a separate endpoint for working within the container server-side
// See our docker-compose.yaml file for more info
const BASE_SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL;
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

// Reducer types
const CREATE_USER = 'CREATE_USER';
const FETCH_ERROR = 'FETCH_ERROR';
const FETCH_IN_PROGRESS = 'FETCH_IN_PROGRESS';
const FETCH_UNKNOWN_ERROR = 'FETCH_UNKNOWN_ERROR';
const GET_TOPICS = 'GET_TOPICS';
const GET_USER = 'GET_USER';
const USER_SIGN_IN = 'USER_SIGN_IN';

// Miscellaneous
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/u;
const FETCH_UNAUTHORIZED = 'Invalid authentication credentials';

export {
  BASE_SERVER_URL,
  BASE_URL,
  CREATE_USER,
  EMAIL_REGEX,
  FETCH_ERROR,
  FETCH_IN_PROGRESS,
  FETCH_UNAUTHORIZED,
  FETCH_UNKNOWN_ERROR,
  GET_TOPICS,
  GET_USER,
  USER_SIGN_IN,
};
