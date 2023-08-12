import { ReactNode } from 'react';

export interface LabelProps {
  forAttribute: string;
  name?: string;
  children?: ReactNode;
}

/**
 *
 * @param forAttribute only required attribute to wire up with inputs
 * @param name isn't required in case we ever want to use it not wrapping an input
 * Otherwise, make sure you include it
 * @returns
 */
export const Label = ({ children, name, forAttribute }: LabelProps) => {
  return (
    <label className='cursor-pointer text-xl' htmlFor={forAttribute}>
      {name}
      {children}
    </label>
  );
};
