import '@testing-library/jest-dom';

import { render, renderWithUserEvent, screen } from 'custom-rtl';
import { Question, QuestionProps } from '../../../app/components/molecules/Question';
import { questionTestData } from '../../../test-utils/shared-data';

describe('Question Molecule', () => {
  const onChangeMock = jest.fn();
  const props: QuestionProps = {
    handleSelectedAnswer: onChangeMock,
    answer_options: questionTestData[0].answer_options,
    question: questionTestData[0].question,
    quizQuestionId: 'fake-uuid',
    user_answer: null,
  };

  test('loads and displays a question with answers', async () => {
    render(<Question {...props} />);

    expect(screen.getByText(questionTestData[0].question)).toBeInTheDocument();
    expect(screen.getByText(questionTestData[0].answer_options[0].option_1)).toBeInTheDocument();
    expect(screen.getByText(questionTestData[0].answer_options[1].option_2)).toBeInTheDocument();
    expect(screen.getByText(questionTestData[0].answer_options[2].option_3)).toBeInTheDocument();
    expect(screen.getByText(questionTestData[0].answer_options[3].option_4)).toBeInTheDocument();
  });

  test('user can successfully select an answer', async () => {
    const { user } = renderWithUserEvent(<Question {...props} />);
    const firstAnswerOption: HTMLButtonElement = screen.getByText(
      questionTestData[0].answer_options[0].option_1
    );

    await user.click(firstAnswerOption);

    expect(onChangeMock).toHaveBeenCalled();
  });

  test('user cannot interact with answer options if the question is disabled', async () => {
    const { user } = renderWithUserEvent(<Question disabled {...props} />);
    const firstAnswerOption: HTMLButtonElement = screen.getByText(
      questionTestData[0].answer_options[0].option_1
    );

    await user.click(firstAnswerOption);

    expect(onChangeMock).not.toHaveBeenCalled();
  });
});
