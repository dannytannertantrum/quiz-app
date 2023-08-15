import { AuthForm } from '../components/organisms/AuthForm';

export default function SignInPage() {
  return (
    <main className='flex flex-col items-center gap-4 md:p-8'>
      <AuthForm />
    </main>
  );
}
