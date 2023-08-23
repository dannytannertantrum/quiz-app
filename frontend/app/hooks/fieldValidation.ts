'use client';

import { useState } from 'react';

import { EMAIL_REGEX } from '../utils/constants';

export interface FieldValidationProperties {
  name: string;
  required: boolean;
  maxLength?: number;
  minLength?: number;
}

export const useInput = (element: FieldValidationProperties, initialValue = '') => {
  const [value, setValue] = useState(initialValue);
  const [touched, setTouched] = useState(false);
  const [hasTyped, setHasTyped] = useState(false);
  const [error, setError] = useState('');

  const validate = (inputValue: string): void => {
    inputValue = inputValue.trim();

    if (element.name.toLowerCase() === 'email' && !EMAIL_REGEX.test(inputValue)) {
      setError('Please enter a valid email address, e.g. email@example.com');
      return;
    }
    if (element.required && inputValue === '') {
      setError(`${element.name} cannot be blank `);
      return;
    }
    if (element.minLength && inputValue.length < element.minLength) {
      setError(`${element.name} must be greater than ${element.minLength} characters`);
      return;
    }
    if (element.maxLength && inputValue.length > element.maxLength) {
      setError(`${element.name} cannot be greater than ${element.minLength} characters`);
      return;
    }

    setError('');
  };

  const handleChange = (value: string): void => {
    setValue(value);
    setHasTyped(true);
    // The second check is in case the user tried submitting the form completely blank
    if (touched || (error && hasTyped)) {
      validate(value);
    }
  };

  const handleBlur = (): void => {
    if (value === '' && !element.required) {
      setError('');
      return;
    }

    if (hasTyped) {
      setTouched(true);
      validate(value);
    }
  };

  const reset = (): void => {
    setError('');
    setTouched(false);
    setHasTyped(false);
    setValue('');
  };

  return {
    error,
    handleBlur,
    handleChange,
    hasTyped,
    reset,
    setError,
    touched,
    validate,
    value,
  };
};
