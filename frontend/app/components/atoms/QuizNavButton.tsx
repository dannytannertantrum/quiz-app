import { CSSProperties, ReactNode } from 'react';

import { FaSolidArrowLeft } from '../../../public/svgs/FaSolidArrowLeft';
import { FaSolidArrowRight } from '../../../public/svgs/FaSolidArrowRight';

interface QuizNavButtonProps {
  direction: 'previous' | 'next';
  handleNavClick: () => void;
  children?: ReactNode;
  styles?: CSSProperties;
  twClasses?: string;
}

export const QuizNavButton = ({
  children,
  direction,
  handleNavClick,
  styles,
  twClasses,
}: QuizNavButtonProps) => {
  return (
    <button
      className={`flex items-center pt-2 ${twClasses && twClasses}`}
      onClick={handleNavClick}
      style={styles}
    >
      {direction === 'previous' && <FaSolidArrowLeft className='mr-3 w-5 h-5 sm:w-8 sm:h-8' />}
      <span className='sm:text-xl'>{children}</span>
      {direction === 'next' && <FaSolidArrowRight className='ml-3 w-5 h-5 sm:w-8 sm:h-8' />}
    </button>
  );
};
