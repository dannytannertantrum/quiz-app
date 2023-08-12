'use client';

import { ChangeEvent, useEffect, useState } from 'react';

import { FaEyeSlash } from '../../../public/svgs/FaEyeSlash';
import { FaSolidEye } from '../../../public/svgs/FaSolidEye';

export interface TextInputProps {
  handleOnChange: (value: string) => void;
  name: string;
  disabled?: boolean;
  errorMessage?: string;
  id?: string;
  autofocus?: boolean;
  minlength?: number;
  maxlength?: number;
  pattern?: string;
  required?: boolean;
  type?: string;
  value?: string | number;
}

/**
 * An input element for 'text', 'password', 'number' or 'email'
 * @param name required
 * @param handleOnChange required
 * @returns an input element
 */
export const TextInput = ({
  autofocus,
  disabled,
  errorMessage,
  handleOnChange,
  id,
  minlength,
  maxlength,
  name,
  pattern,
  required,
  type,
  value,
}: TextInputProps) => {
  const [isPasswordShowing, setIsPasswordShowing] = useState(false);
  const [displayType, setDisplayType] = useState(type);

  useEffect(() => {
    if (type === 'password') {
      if (isPasswordShowing) {
        setDisplayType('text');
      } else {
        setDisplayType('password');
      }
    }
  }, [isPasswordShowing, setDisplayType, type]);

  return (
    <div className='flex flex-col relative w-full sm:w-80'>
      <input
        autoFocus={autofocus ?? false}
        className={`bg-thunder-300 p-2.5 rounded mb-7 mt-1 text-lg
        disabled:bg-slate-400 disabled:text-slate-800 disabled:cursor-not-allowed
        dark:bg-thunder-900 dark:disabled:bg-slate-400 dark:disabled:text-slate-800`}
        data-testid='text-input'
        disabled={disabled}
        id={id}
        maxLength={maxlength ?? 64}
        minLength={minlength ?? 6}
        name={name}
        onChange={(e: ChangeEvent<HTMLInputElement>) => handleOnChange(e.target.value)}
        pattern={pattern}
        required={required}
        type={displayType ?? 'text'}
        value={value}
      />
      {type === 'password' && (
        <button
          aria-label='toggle view/hide password'
          className='absolute top-3 right-4'
          onClick={() => setIsPasswordShowing(!isPasswordShowing)}
        >
          {isPasswordShowing ? <FaSolidEye width={20} /> : <FaEyeSlash width={20} />}
        </button>
      )}
      {errorMessage && (
        <p className='relative -top-6 font-semibold text-red-900 text-sm dark:text-red-200'>
          {errorMessage}
        </p>
      )}
    </div>
  );
};
