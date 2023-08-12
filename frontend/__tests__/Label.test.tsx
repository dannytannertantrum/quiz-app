import '@testing-library/jest-dom';

import { render, renderWithUserEvent, screen } from 'test-utils';
import { Label } from '../app/components/atoms/Label';
import { TextInput } from '../app/components/atoms/TextInput';

describe('Label', () => {
  test('loads and displays a label', () => {
    render(<Label forAttribute='myInput'>Email:</Label>);

    expect(screen.getByText('Email:')).toBeInTheDocument();
  });

  test('When a user clicks on a label containing an input element, the focus goes to the input', async () => {
    const labelInputName = 'myInput';
    const { user } = renderWithUserEvent(
      <Label forAttribute={labelInputName}>
        Email:
        <TextInput handleOnChange={() => {}} name={labelInputName} id={labelInputName} />
      </Label>
    );
    const textInput: HTMLInputElement = screen.getByTestId('text-input');
    const labelComponent = screen.getByText('Email:');

    await user.click(labelComponent);

    expect(textInput).toHaveFocus();
  });
});
