import '@testing-library/jest-dom';

import { render, screen, waitFor } from 'custom-rtl';
import { Quiz } from '../../../app/components/organisms/Quiz';
import {
  quizQuestionsTestDataAllNullAnswers,
  quizTestData,
  quizQuestionsTestDataWithFirstIndexAnswered,
} from '../../../test-utils/shared-data';

describe('Quiz', () => {
  test('loads and displays a Quiz organism', () => {
    render(<Quiz quiz={quizTestData} quizQuestions={quizQuestionsTestDataAllNullAnswers} />);

    expect(screen.getByText(quizQuestionsTestDataAllNullAnswers[0].question)).toBeInTheDocument();
    expect(
      screen.getByText(quizQuestionsTestDataAllNullAnswers[0].answer_options[0].option_1)
    ).toBeInTheDocument();
  });

  test('it only displays the question at the active index', () => {
    render(<Quiz quiz={quizTestData} quizQuestions={quizQuestionsTestDataAllNullAnswers} />);

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
    render(
      <Quiz quiz={quizTestData} quizQuestions={quizQuestionsTestDataWithFirstIndexAnswered} />
    );

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
});
