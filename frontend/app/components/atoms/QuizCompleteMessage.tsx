'use client';

export interface QuizCompleteMessageProps {
  primaryTopic: string;
  score: number;
}

const getScoreMessage = (topic: string, score: number) => {
  switch (true) {
    case score < 60:
      return `Wow...you're really terrible at ${topic} 🤦`;
    // There are only 5 questions, so anything over 80 will be a perfect score
    // But doing this in case we want to increase the number of questions later on
    case score >= 60 && score <= 95:
      return `Looks like you know a thing or two about ${topic}! Not bad 👏`;
    default:
      return `Woo hoo! You're a ${topic} superstar ⭐`;
  }
};

export const QuizCompleteMessage = ({ primaryTopic, score }: QuizCompleteMessageProps) => {
  const baseClasses = '[font-size:_clamp(1.25rem,5vw,2.5rem)] [text-wrap:balance] mb-4 ';
  const message = getScoreMessage(primaryTopic, score);
  let gradientText = '';
  if (score > 95) {
    gradientText =
      'text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-950 via-green-900 to-green-700 dark:from-cyan-300 dark:via-green-500 dark:to-green-300';
  }
  const appliedClasses = baseClasses + gradientText;

  return <h2 className={appliedClasses}>{message}</h2>;
};
