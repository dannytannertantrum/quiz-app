import { ReactNode } from 'react';

export interface FieldsetProps {
  disabled?: boolean;
  children?: ReactNode;
  legend?: string;
  legendCenter?: boolean;
  legendSize?: 'small' | 'medium' | 'large';
  twClasses?: string;
}

const getLegendClasses = (legendSize: string): string => {
  switch (legendSize) {
    case 'small':
      return 'text-2xl mb-3';
    case 'large':
      return 'text-4xl mb-6';
    default:
      return 'text-2xl sm:text-3xl mb-4';
  }
};

/**
 *
 * @param disabled great for disabling the whole fieldset group
 * upon a form submission
 * @param legendSize small = 2xl, medium = 3xl, large = 4x defaults to medium
 * @param legendCenter deaults to false
 */
export const Fieldset = ({
  children,
  disabled,
  legend,
  legendCenter = false,
  legendSize = 'medium',
  twClasses = '',
}: FieldsetProps) => {
  const legendFont = getLegendClasses(legendSize);
  const legendCenterClasses = legendCenter ? ' text-center' : '';
  const appliedLegendClasses = legendFont + legendCenterClasses;

  return (
    <fieldset data-testid='test-fieldset' disabled={disabled} className={twClasses}>
      <legend className={appliedLegendClasses}>{legend}</legend>
      {children}
    </fieldset>
  );
};
