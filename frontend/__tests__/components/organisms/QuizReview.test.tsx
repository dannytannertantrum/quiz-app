import '@testing-library/jest-dom';

import { render, screen } from 'custom-rtl';
import { QuizReview } from '../../../app/components/organisms/QuizReview';
import { quizReviewTestData } from '../../../test-utils/shared-data';

describe('QuizReview', () => {
  test('loads and displays a QuizReview organism', () => {
    render(<QuizReview quizCompleteData={quizReviewTestData} />);

    expect(screen.getByText('Hello!')).toBeInTheDocument();
  });
});
