'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useTheme } from 'next-themes';
import { useContext, useEffect, useState } from 'react';

import { AuthContext } from '../../context/AuthContext';
import { ThemeSwitcher } from '../atoms/ThemeSwitcher';
import logoDarkMode from '../../../public/images/logoDarkMode.png';
import logoLightMode from '../../../public/images/logoLightMode.png';
import { QLink } from '../atoms/QLink';

export const Header = () => {
  const { theme } = useTheme();
  const [image, setImage] = useState(logoDarkMode);
  const { userState } = useContext(AuthContext);
  const homeLink = userState?.data ? '/topics' : '/';

  useEffect(() => {
    if (theme === 'light') {
      setImage(logoLightMode);
    } else {
      setImage(logoDarkMode);
    }
  }, [theme]);

  return (
    <header
      className={`px-4 border-b border-b-thunder-800 bg-thunder-100
    dark:border-b dark:border-b-thunder-300 dark:bg-thunder-1000`}
    >
      <nav className='flex justify-between items-center py-3 mx-auto max-w-7xl gap-4'>
        <Link href={homeLink} className='flex mr-auto'>
          <Image
            alt='Home'
            src={image ?? logoDarkMode}
            className='object-scale-down object-left max-md:w-10'
            width={64}
            height={42}
          />
        </Link>
        <QLink href='/about'>About</QLink>
        {userState?.data && <QLink href='/account'>Account</QLink>}
        <ThemeSwitcher />
      </nav>
    </header>
  );
};
