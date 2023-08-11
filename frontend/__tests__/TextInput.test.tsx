import '@testing-library/jest-dom';

import { render, renderWithUserEvent, screen } from 'test-utils';
import { TextInput } from '../app/components/atoms/TextInput';

describe('TextInput', () => {
  let onChangeMock: (value: string) => void;

  beforeEach(() => {
    onChangeMock = jest.fn();
  });

  test('loads and displays a functioning input type text', async () => {
    const { user } = renderWithUserEvent(
      <TextInput name='myInput' handleOnChange={onChangeMock} />
    );
    const textInput: HTMLInputElement = screen.getByTestId('text-input');
    const text = 'stuff';

    await user.type(textInput, text);

    expect(textInput.value).toEqual(text);
  });

  test('displays an error message if the prop is defined', () => {
    const error = 'You done messed up';
    render(<TextInput name='myInput' handleOnChange={onChangeMock} errorMessage={error} />);

    expect(screen.getByText(error)).toBeInTheDocument();
  });

  test('user cannot interact with input if element is disabled', async () => {
    const { user } = renderWithUserEvent(
      <TextInput name='myInput' handleOnChange={onChangeMock} disabled />
    );
    const textInput: HTMLInputElement = screen.getByTestId('text-input');
    const text = 'stuff';

    await user.type(textInput, text);

    expect(textInput.value).toEqual('');
  });

  test('icon shows when type is set to password', () => {
    render(<TextInput name='myInput' handleOnChange={onChangeMock} type='password' />);

    expect(screen.getByRole('button', { name: 'toggle view/hide password' })).toBeInTheDocument();
  });
});
