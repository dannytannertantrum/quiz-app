import { CSSProperties } from 'react';

export interface LoaderProps {
  center?: boolean;
  styles?: CSSProperties;
}

/**
 *
 * @param center wraps a full-width div centered with flex
 * @param styles customize any way necessary
 * @returns a spinning question mark for loading states
 */
export const QuizLoader = ({ center, styles }: LoaderProps) => {
  const loaderClasses = `flex ${center && 'w-full justify-center items-center'}`;

  return (
    <span className={loaderClasses}>
      <span className='animate-spin' style={styles}>
        ?
      </span>
    </span>
  );
};
