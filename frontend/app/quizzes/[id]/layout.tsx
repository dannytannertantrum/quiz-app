export default function QuizzesLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className='flex flex-col items-center gap-4 p-7 mx-auto max-w-5xl md:py-7 md:px-0'>
      {children}
    </main>
  );
}
