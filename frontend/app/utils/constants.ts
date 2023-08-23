// With Docker, we need to configure a separate endpoint for working within the container server-side
// See our docker-compose.yaml file for more info
const BASE_SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL;
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

// Reducer types
const CREATE_USER = 'CREATE_USER';
const FETCH_ERROR = 'FETCH_ERROR';
const FETCH_IN_PROGRESS = 'FETCH_IN_PROGRESS';
const FETCH_UNKNOWN_ERROR = 'FETCH_UNKNOWN_ERROR';

const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/u;

export {
  BASE_SERVER_URL,
  BASE_URL,
  CREATE_USER,
  EMAIL_REGEX,
  FETCH_ERROR,
  FETCH_IN_PROGRESS,
  FETCH_UNKNOWN_ERROR,
};
