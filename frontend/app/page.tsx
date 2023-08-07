import ColorSchemeToggle from './components/atoms/ColorSchemeToggle';

export default function Home() {
  return (
    <main className='flex min-h-screen flex-col items-center gap-4 p-24'>
      <h2 className='text-6xl'>Hello, World!</h2>
      <ColorSchemeToggle />
    </main>
  );
}
