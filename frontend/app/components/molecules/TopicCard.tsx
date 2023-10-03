export interface TopicCardProps {
  description: string;
  title: string;
  color?: 'cyan' | 'emerald' | 'yellow';
}

const getAppliedClasses = (color: string): string => {
  switch (color) {
    case 'emerald':
      return 'bg-emerald-100 border-emerald-950 text-emerald-950 dark:bg-emerald-950 dark:border-emerald-100 dark:text-emerald-100';
    case 'yellow':
      return 'bg-yellow-100 border-yellow-950 text-yellow-950 dark:bg-yellow-950 dark:border-yellow-100 dark:text-yellow-100';
    default:
      return 'bg-cyan-100 border-cyan-950 text-cyan-950 dark:bg-cyan-950 dark:border-cyan-100 dark:text-cyan-100';
  }
};

export const TopicCard = ({ color = 'cyan', description, title }: TopicCardProps) => {
  const baseClasses = 'rounded-lg p-4 border-2 ';
  const colorVariations = getAppliedClasses(color);
  const appliedClasses = baseClasses + colorVariations;

  return (
    <div className={appliedClasses}>
      <h3 className='text-2xl'>{title}</h3>
      <p className='text-lg'>{description}</p>
    </div>
  );
};
