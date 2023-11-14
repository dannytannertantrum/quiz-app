import Link from 'next/link';
import { ReactNode } from 'react';

export interface QLinkProps {
  href: string;
  children?: ReactNode;
}

export const QLink = ({ children, href }: QLinkProps) => {
  return (
    <Link
      className='bg-transparent underline text-outer-space-900 text-xl hover:text-outer-space-1000
        dark:text-outer-space-300 dark:hover:text-outer-space-200 transition-colors underline-offset-4 decoration-2'
      href={href}
    >
      {children}
    </Link>
  );
};
