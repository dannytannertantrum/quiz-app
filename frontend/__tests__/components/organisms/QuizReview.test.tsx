import '@testing-library/jest-dom';

import { render, renderWithUserEvent, screen, waitFor } from 'custom-rtl';
import { QuizReview } from '../../../app/components/organisms/QuizReview';
import { quizReviewTestData } from '../../../test-utils/shared-data';

describe('QuizReview', () => {
  describe('When complete search param is true', () => {
    beforeEach(() => {
      Object.defineProperty(window, 'location', {
        writable: true,
        value: jest.fn().mockImplementation(() => ({
          search: '?complete=true',
        })),
      });
    });

    test('loads the correct low score message', async () => {
      render(<QuizReview quizCompleteData={quizReviewTestData} />);

      waitFor(() => expect(screen.queryByText(/Woo hoo!/)).toBeInTheDocument());
    });

    test('loads the correct medium score message', async () => {
      const propsWithMediumScore = {
        ...quizReviewTestData,
        score: 75,
      };
      render(<QuizReview quizCompleteData={propsWithMediumScore} />);

      waitFor(() => expect(screen.queryByText(/Woo hoo!/)).toBeInTheDocument());
    });

    test('loads the correct high score message', async () => {
      const propsWithHighScore = {
        ...quizReviewTestData,
        score: 100,
      };
      render(<QuizReview quizCompleteData={propsWithHighScore} />);

      waitFor(() => expect(screen.queryByText(/Woo hoo!/)).toBeInTheDocument());
    });

    test('when user clicks review answers, the review page updates to show all questions and answers', async () => {
      const { user } = renderWithUserEvent(<QuizReview quizCompleteData={quizReviewTestData} />);

      waitFor(async () => {
        const reviewAnswersButton: HTMLButtonElement = screen.getByText('Review Answers');

        await user.click(reviewAnswersButton);

        expect(screen.queryByText(/Quiz/)).toBeInTheDocument();
      });
    });
  });

  describe('When complete search param is not true', () => {
    test('loads and displays a QuizReview organism', () => {
      render(<QuizReview quizCompleteData={quizReviewTestData} />);

      expect(screen.getByText(/Score/)).toBeInTheDocument();
    });
  });
});
