import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import { AuthRedirectMessage } from './components/atoms/AuthRedirectMessage';
import { BaseUserData } from './types/users';
import { AuthForm } from './components/organisms/AuthForm';
import { BASE_SERVER_URL, BASE_CLIENT_URL, RESPONSE_ERROR } from './utils/constants';

async function getUserEmails() {
  const response = await fetch(`${BASE_SERVER_URL}/users/`);
  if (!response.ok) {
    throw new Error(RESPONSE_ERROR);
  }
  return await response.json();
}

export default async function SignInPage() {
  const authCookie = cookies().get('access_token');
  let emails: BaseUserData['email'][] = [];
  try {
    emails = await getUserEmails();
  } catch (error: any) {
    console.error('There was a problem getting all user emails: ', error);
  }

  if (authCookie) {
    redirect(`${BASE_CLIENT_URL}/topics`);
  }

  return (
    <main className='flex flex-col items-center gap-4 md:p-8'>
      <AuthRedirectMessage />
      <AuthForm userEmails={emails} />
    </main>
  );
}
