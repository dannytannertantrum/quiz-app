'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

import { ThemeSwitcher } from '../atoms/ThemeSwitcher';
import logoDarkMode from '../../../public/images/logoDarkMode.png';
import logoLightMode from '../../../public/images/logoLightMode.png';

export const Header = () => {
  const { theme } = useTheme();
  const [image, setImage] = useState(logoDarkMode);

  useEffect(() => {
    if (theme === 'light') {
      setImage(logoLightMode);
    } else {
      setImage(logoDarkMode);
    }
  }, [theme]);

  return (
    <header className='px-4 border-b border-b-thunder-800 dark:border-b dark:border-b-thunder-300'>
      <nav className='flex justify-between my-3 mx-auto max-w-7xl'>
        <Link href='/' className='flex'>
          <Image
            alt='Home'
            src={image ?? logoDarkMode}
            className='object-scale-down object-left max-md:w-8'
            width={64}
            height={42}
            priority
          />
        </Link>
        <ThemeSwitcher />
      </nav>
    </header>
  );
};
