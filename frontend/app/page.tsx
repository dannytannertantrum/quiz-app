import { BaseUserData } from './types/users';
import { AuthForm } from './components/organisms/AuthForm';
import { BASE_SERVER_URL } from './utils/constants';

async function getUserEmails() {
  const response = await fetch(`${BASE_SERVER_URL}/users/`);
  if (!response.ok) {
    throw new Error('Failed to fetch data');
  }
  return await response.json();
}

export default async function SignInPage() {
  let emails: BaseUserData['email'][] = [];
  try {
    emails = await getUserEmails();
  } catch (error: any) {
    console.error('There was a problem getting all user emails: ', error);
  }

  return (
    <main className='flex flex-col items-center gap-4 md:p-8'>
      <AuthForm userEmails={emails} />
    </main>
  );
}
