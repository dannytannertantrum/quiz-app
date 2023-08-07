'use client';

import { useEffect, useState } from 'react';

import { FaSolidAdjust } from '../svgs/AdjustColorScheme';

const ColorSchemeToggle = (): JSX.Element => {
  const [isDarkMode, setIsDarkMode] = useState<boolean | null>(
    localStorage.getItem('darkMode') == 'enabled'
  );

  useEffect(() => {
    if (
      localStorage.getItem('darkMode') == 'enabled' ||
      (!('darkMode' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)
    ) {
      document.body.classList.add('darkmode');
      localStorage.setItem('darkMode', 'enabled');
      setIsDarkMode(true);
    }
  }, []);

  const toggleDarkMode = () => {
    if (isDarkMode) {
      document.body.classList.remove('darkmode');
      localStorage.setItem('darkMode', '');
      setIsDarkMode(false);
    } else {
      document.body.classList.add('darkmode');
      localStorage.setItem('darkMode', 'enabled');
      setIsDarkMode(true);
    }
  };

  return (
    <button className='text-3xl' aria-label='toggle light and dark mode' onClick={toggleDarkMode}>
      <FaSolidAdjust fill={isDarkMode ? '#c8b1c8' : '#2f232e'} />
    </button>
  );
};

export default ColorSchemeToggle;
