import { Button } from '../components/atoms/Button';
import { Fieldset } from '../components/atoms/Fieldset';
import { TextInput } from '../components/molecules/TextInput';
import { FieldValidationProperties, useInput } from '../hooks/fieldValidation';

const baseValidationProperties: Pick<FieldValidationProperties, 'required'> = {
  required: true,
};

export const SignIn = () => {
  const emailInput = useInput({ ...baseValidationProperties, name: 'Email' }, '');
  const passwordInput = useInput(
    { ...baseValidationProperties, name: 'Password', maxLength: 64, minLength: 8 },
    ''
  );

  return (
    <form className='w-full sm:w-auto sm:min-w-[450px]' noValidate>
      <h2 className='text-4xl mb-6'>Sign In</h2>
      <Fieldset>
        <TextInput
          errorMessage={emailInput.error}
          handleOnBlur={emailInput.handleBlur}
          handleOnChange={emailInput.handleChange}
          id='email'
          label='Email address'
          name='username' // 'username' is the expected key for the OAUTH spec
          placeholder='Email address'
          type='email'
          value={emailInput.value}
        />
        <TextInput
          errorMessage={passwordInput.error}
          handleOnBlur={passwordInput.handleBlur}
          handleOnChange={passwordInput.handleChange}
          id='password'
          label='Password'
          maxlength={64}
          minlength={8}
          name='password'
          placeholder='Password'
          type='password'
          value={passwordInput.value}
        />
        <Button type='submit'>Click me</Button>
      </Fieldset>
    </form>
  );
};
