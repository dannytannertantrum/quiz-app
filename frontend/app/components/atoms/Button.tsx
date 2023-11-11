import { CSSProperties, ReactNode } from 'react';

export interface LabelProps {
  children?: ReactNode;
  disabled?: boolean;
  onClick?: () => void;
  secondary?: boolean;
  styles?: CSSProperties;
  type?: 'button' | 'submit' | 'reset';
}

export const Button = ({ children, disabled, onClick, secondary, styles, type }: LabelProps) => {
  const baseButtonClasses = `cursor-pointer disabled:cursor-not-allowed disabled:text-slate-500
  dark:disabled:text-slate-300 `;
  const primaryClasses = `py-3 px-7 bg-thunder-300 border border-thunder-800 rounded-xl text-lg sm:text-xl text-thunder-950
  hover:bg-thunder-400 hover:transition-colors hover:duration-300 hover:text-thunder-1000 disabled:bg-slate-300 disabled:border-slate-500
  dark:border dark:border-thunder-300 dark:bg-thunder-800 dark:text-thunder-200
  dark:hover:bg-thunder-700 dark:hover:transition-colors dark:hover:duration-300 dark:hover:text-thunder-100
  dark:disabled:bg-slate-500 dark:disabled:border-slate-300`;
  const secondaryClasses = `bg-transparent underline underline-offset-3 decoration-2 text-outer-space-900 text-lg hover:text-outer-space-1000
  dark:text-outer-space-300 dark:hover:text-outer-space-200 transition-colors`;
  const appliedClasses = secondary
    ? baseButtonClasses + secondaryClasses
    : baseButtonClasses + primaryClasses;

  return (
    <button
      className={appliedClasses}
      disabled={disabled}
      onClick={onClick}
      style={styles}
      type={type}
    >
      {children}
    </button>
  );
};
