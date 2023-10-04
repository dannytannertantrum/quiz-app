'use client';

export interface TopicCardProps {
  description: string;
  title: string;
  color?: 'cyan' | 'emerald' | 'yellow';
}

const getAppliedClasses = (color: string): string => {
  switch (color) {
    case 'emerald':
      return 'bg-emerald-200 border-emerald-950 text-emerald-950 dark:bg-emerald-950 dark:border-emerald-200 dark:text-emerald-200';
    case 'yellow':
      return 'bg-yellow-200 border-yellow-950 text-yellow-950 dark:bg-yellow-950 dark:border-yellow-200 dark:text-yellow-200';
    default:
      return 'bg-cyan-200 border-cyan-950 text-cyan-950 dark:bg-cyan-950 dark:border-cyan-200 dark:text-cyan-200';
  }
};

export const TopicCard = ({ color = 'cyan', description, title }: TopicCardProps) => {
  const baseClasses = 'rounded-lg p-4 border-2 md:h-full ';
  const colorVariations = getAppliedClasses(color);
  const appliedClasses = baseClasses + colorVariations;

  return (
    <div className={appliedClasses}>
      <h3 className='text-2xl'>{title}</h3>
      <p className='text-lg'>{description}</p>
    </div>
  );
};
