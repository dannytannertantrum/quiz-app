import { WelcomeMessage } from '../components/atoms/WelcomeMessage';

export default function Topics() {
  return (
    <main className='flex flex-col items-center gap-4 md:p-8'>
      <WelcomeMessage />
      <h2>Topics!</h2>
    </main>
  );
}
