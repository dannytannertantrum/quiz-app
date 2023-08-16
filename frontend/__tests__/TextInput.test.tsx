import '@testing-library/jest-dom';

import { render, renderWithUserEvent, screen } from 'custom-rtl';
import { TextInput } from '../app/components/molecules/TextInput';

describe('TextInput', () => {
  let onChangeMock: (value: string) => void;
  let onBlurMock: () => void;

  const props = {
    id: 'email',
    label: 'Email address',
    name: 'email',
    placeholder: 'Email address',
  };

  beforeEach(() => {
    onChangeMock = jest.fn();
  });

  test('loads and displays a functioning input type text', async () => {
    const { user } = renderWithUserEvent(
      <TextInput handleOnBlur={onBlurMock} handleOnChange={onChangeMock} {...props} />
    );
    const textInput: HTMLInputElement = screen.getByTestId('text-input');
    const text = 'stuff';

    await user.type(textInput, text);

    expect(textInput.value).toEqual(text);
  });

  test('displays an error message if the prop is defined', () => {
    const error = 'You done messed up';
    render(
      <TextInput
        errorMessage={error}
        handleOnBlur={onBlurMock}
        handleOnChange={onChangeMock}
        {...props}
      />
    );

    expect(screen.getByText(error)).toBeInTheDocument();
  });

  test('user cannot interact with input if element is disabled', async () => {
    const { user } = renderWithUserEvent(
      <TextInput disabled handleOnBlur={onBlurMock} handleOnChange={onChangeMock} {...props} />
    );
    const textInput: HTMLInputElement = screen.getByTestId('text-input');
    const text = 'stuff';

    await user.type(textInput, text);

    expect(textInput.value).toEqual('');
  });

  test('icon shows when type is set to password', () => {
    render(
      <TextInput
        handleOnBlur={onBlurMock}
        handleOnChange={onChangeMock}
        type='password'
        {...props}
      />
    );

    expect(screen.getByRole('button', { name: 'toggle view/hide password' })).toBeInTheDocument();
  });
});
