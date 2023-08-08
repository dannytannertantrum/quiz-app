'use client';

import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';

import { FaSolidAdjust } from '../svgs/AdjustColorScheme';

interface ColorSchemeToggleProps {
  size?: number;
}

export const ThemeSwitcher = ({ size }: ColorSchemeToggleProps): JSX.Element | null => {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <button
      className={'text-xl sm:text-3xl'}
      style={size ? { fontSize: `${size}px` } : {}}
      aria-label='toggle light and dark mode'
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
    >
      <FaSolidAdjust />
    </button>
  );
};
