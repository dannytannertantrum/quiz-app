import { ReactNode } from 'react';

export interface LabelProps {
  forAttribute: string;
  name: string;
  children?: ReactNode;
}

export const Label = ({ children, name, forAttribute }: LabelProps) => {
  return (
    <label className='cursor-pointer text-xl' htmlFor={forAttribute}>
      {name}
      {children}
    </label>
  );
};
