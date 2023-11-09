'user client';

interface ProgressProps {
  max: number;
  value: number;
}

export const ProgressBar = ({ max, value }: ProgressProps) => {
  return (
    <progress
      aria-label={`${value} of ${max} questions complete`}
      value={value}
      max={max}
      className='fixed left-0 w-full sm:static sm:mb-4'
    >
      {value}
    </progress>
  );
};
