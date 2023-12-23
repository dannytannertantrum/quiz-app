import type { Metadata } from 'next';

import { AboutPage } from '@/components/organisms/AboutPage';

export const metadata: Metadata = {
  title: 'About | Quiz App',
  description: 'What is the point of this site anyway?',
};

export default async function About() {
  return <AboutPage />;
}
