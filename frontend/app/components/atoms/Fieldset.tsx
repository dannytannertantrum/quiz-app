import { ReactNode } from 'react';

export interface FieldsetProps {
  disabled?: boolean;
  children?: ReactNode;
}

/**
 *
 * @param disabled optional and great for disabling the whole fieldset group
 * upon a form submission
 * We could have just used a native <fieldset> element, but this is nice for testing
 * purposes and if we want to style it
 * @returns
 */
export const Fieldset = ({ children, disabled }: FieldsetProps) => {
  return (
    <fieldset data-testid='test-fieldset' disabled={disabled}>
      {children}
    </fieldset>
  );
};
