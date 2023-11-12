import '@testing-library/jest-dom';

import { render, screen } from 'custom-rtl';
import { ReviewQuestions } from '../../../app/components/molecules/ReviewQuestions';
import { quizReviewTestData } from '../../../test-utils/shared-data';

describe('ReviewQuestions', () => {
  beforeEach(() => {
    render(<ReviewQuestions questions={quizReviewTestData.questions_data} />);
  });

  test('loads and displays a ReviewQuestions organism', () => {
    expect(
      screen.getByText(`Q1: ${quizReviewTestData.questions_data[0].question}`)
    ).toBeInTheDocument();
  });

  test('an X shows beside a wrong answer', () => {
    expect(
      screen.getByText(`${quizReviewTestData.questions_data[0].answer_options[1].option_2} (X)`)
    ).toBeInTheDocument();
  });
});
