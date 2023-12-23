import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import { AuthForm } from './components/organisms/AuthForm';
import { AuthRedirectMessage } from './components/atoms/AuthRedirectMessage';
import { BASE_SERVER_URL, BASE_CLIENT_URL, RESPONSE_ERROR } from './utils/constants';
import { BaseUserData } from './types/users';
import { DeleteBanner } from './components/atoms/DeleteBanner';
import { TestAccountSignIn } from './components/molecules/TestAccountSignIn';

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
    <main className='flex flex-col items-center md:p-8'>
      <AuthRedirectMessage />
      <DeleteBanner />
      <div className='md:flex md:max-w-5xl md:gap-6 lg:gap-10'>
        <div className='p-7 mb-8 md:mb-0 md:p-0 md:basis-full'>
          <TestAccountSignIn />
        </div>
        <div className='md:basis-full'>
          <AuthForm userEmails={emails} />
        </div>
      </div>
    </main>
  );
}
