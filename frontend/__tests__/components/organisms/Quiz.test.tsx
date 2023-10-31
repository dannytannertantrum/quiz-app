import '@testing-library/jest-dom';

import { render, renderWithUserEvent, screen, waitFor } from 'custom-rtl';
import { Quiz } from '../../../app/components/organisms/Quiz';
import {
  quizQuestionsTestDataAllNullAnswers,
  quizQuestionsTestDataWithFirstIndexAnswered,
} from '../../../test-utils/shared-data';

describe('Quiz', () => {
  test('loads and displays a Quiz organism', () => {
    render(<Quiz quizQuestions={quizQuestionsTestDataAllNullAnswers} />);

    expect(screen.getByText(quizQuestionsTestDataAllNullAnswers[0].question)).toBeInTheDocument();
    expect(
      screen.getByText(quizQuestionsTestDataAllNullAnswers[0].answer_options[0].option_1)
    ).toBeInTheDocument();
  });

  test('it only displays the question at the active index', () => {
    render(<Quiz quizQuestions={quizQuestionsTestDataAllNullAnswers} />);

    waitFor(() => {
      expect(screen.getByText(quizQuestionsTestDataAllNullAnswers[0].question)).toBeInTheDocument();
      expect(
        screen.getByText(quizQuestionsTestDataAllNullAnswers[0].answer_options[0].option_1)
      ).toBeInTheDocument();
      expect(
        screen.queryByText(quizQuestionsTestDataAllNullAnswers[1].question)
      ).not.toBeInTheDocument();
    });
  });

  test('it correctly finds and returns the first question with a null answer', async () => {
    render(<Quiz quizQuestions={quizQuestionsTestDataWithFirstIndexAnswered} />);

    waitFor(() => {
      expect(
        screen.queryByText(quizQuestionsTestDataWithFirstIndexAnswered[0].question)
      ).not.toBeInTheDocument();
      expect(
        screen.getByText(quizQuestionsTestDataWithFirstIndexAnswered[1].answer_options[0].option_1)
      ).toBeInTheDocument();
      expect(
        screen.queryByText(quizQuestionsTestDataWithFirstIndexAnswered[1].question)
      ).not.toBeInTheDocument();
    });
  });

  test('it displays a previous button if at least the first question has been answered', () => {
    render(<Quiz quizQuestions={quizQuestionsTestDataWithFirstIndexAnswered} />);

    expect(screen.getByText('Previous')).toBeInTheDocument();
  });

  test('it displays a next button if a user back tracks to a previously answered question', async () => {
    const { user } = renderWithUserEvent(
      <Quiz quizQuestions={quizQuestionsTestDataWithFirstIndexAnswered} />
    );
    const previousButton: HTMLButtonElement = screen.getByText('Previous');

    await user.click(previousButton);

    waitFor(() => expect(screen.getByText('Next')).toBeInTheDocument());
  });

  test('it displays the previous question after clicking the previous button', async () => {
    const { user } = renderWithUserEvent(
      <Quiz quizQuestions={quizQuestionsTestDataWithFirstIndexAnswered} />
    );
    const previousButton: HTMLButtonElement = screen.getByText('Previous');

    await user.click(previousButton);

    waitFor(() =>
      expect(
        screen.getByText(quizQuestionsTestDataWithFirstIndexAnswered[0].question)
      ).toBeInTheDocument()
    );
  });

  test('it displays the next question after clicking the next button', async () => {
    const { user } = renderWithUserEvent(
      <Quiz quizQuestions={quizQuestionsTestDataWithFirstIndexAnswered} />
    );
    const previousButton: HTMLButtonElement = screen.getByText('Previous');

    await user.click(previousButton);

    waitFor(async () => {
      expect(
        screen.getByText(quizQuestionsTestDataWithFirstIndexAnswered[0].question)
      ).toBeInTheDocument();
      const nextButton: HTMLButtonElement = screen.getByText('Next');

      await user.click(nextButton);
      expect(
        screen.getByText(quizQuestionsTestDataWithFirstIndexAnswered[1].question)
      ).toBeInTheDocument();
    });
  });
});
