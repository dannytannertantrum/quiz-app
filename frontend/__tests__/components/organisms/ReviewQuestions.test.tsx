import '@testing-library/jest-dom';

import { render, screen } from 'custom-rtl';
import { ReviewQuestions } from '../../../app/components/organisms/ReviewQuestions';
import { quizReviewTestData } from '../../../test-utils/shared-data';

describe('ReviewQuestions', () => {
  test('loads and displays a ReviewQuestions organism', () => {
    render(<ReviewQuestions questions={quizReviewTestData.questions_data} />);

    // this will change
    expect(screen.getByText(quizReviewTestData.questions_data[0].question)).toBeInTheDocument();
  });
});
