'use client';

import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';

import { FaSolidAdjust } from '../../../public/svgs/FaSolidAdjust';

interface ColorSchemeToggleProps {
  size?: number;
}

export const ThemeSwitcher = ({ size }: ColorSchemeToggleProps): JSX.Element | null => {
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <button
      aria-label='toggle light and dark mode'
      className='text-xl md:text-3xl'
      onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
      style={size ? { fontSize: `${size}px` } : {}}
      title='Toggle light and dark mode'
    >
      <FaSolidAdjust />
    </button>
  );
};
