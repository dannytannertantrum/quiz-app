import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

import { AuthProvider } from './context/AuthContext';
import { Header } from './components/molecules/Header';
import './globals.css';
import { ThemeProvider } from './context/Theme';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'Quiz App',
  description: 'Take a quiz; get results',
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='en' suppressHydrationWarning>
      <body className={`${inter.variable} min-h-screen`}>
        <ThemeProvider attribute='class' defaultTheme='system' enableSystem>
          <AuthProvider>
            <Header />
            {children}
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
