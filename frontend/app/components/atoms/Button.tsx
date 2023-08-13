import { ReactNode } from 'react';

export interface LabelProps {
  children?: ReactNode;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
}

export const Button = ({ children, disabled, type }: LabelProps) => {
  return (
    <button
      className={`cursor-pointer py-3 px-7 bg-thunder-300 border border-thunder-800 rounded-xl text-xl text-thunder-950
      hover:bg-thunder-400 hover:transition-colors hover:duration-300 hover:text-thunder-1000
      disabled:bg-slate-300 disabled:text-slate-500 disabled:border-slate-500 disabled:cursor-not-allowed
      dark:border dark:border-thunder-300 dark:bg-thunder-800 dark:text-thunder-200
      dark:hover:bg-thunder-700 dark:hover:transition-colors dark:hover:duration-300 dark:hover:text-thunder-100
      dark:disabled:bg-slate-500 dark:disabled:text-slate-300 dark:disabled:border-slate-300 dark:disabled:cursor-not-allowed`}
      disabled={disabled}
      type={type}
    >
      {children}
    </button>
  );
};
