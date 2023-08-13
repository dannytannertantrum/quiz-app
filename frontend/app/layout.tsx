import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

import { Header } from './components/molecules/Header';
import './globals.css';
import { ThemeProvider } from './context/Theme';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'Quiz App',
  description: 'Take a quiz; get results',
};

export default function RootLayout({
  authHome,
  children,
  signIn,
}: {
  authHome: React.ReactNode;
  children: React.ReactNode;
  signIn: React.ReactNode;
}) {
  const isSignedIn = false; // Will change this after wiring up auth

  return (
    <html lang='en' suppressHydrationWarning>
      <body className={`${inter.variable} min-h-screen`}>
        <ThemeProvider attribute='class' defaultTheme='system' enableSystem>
          <Header />
          {isSignedIn ? authHome : signIn}
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
