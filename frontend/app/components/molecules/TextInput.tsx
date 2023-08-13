'use client';

import { ChangeEvent, useEffect, useState } from 'react';

import { FaEyeSlash } from '../../../public/svgs/FaEyeSlash';
import { FaSolidEye } from '../../../public/svgs/FaSolidEye';

export interface TextInputProps {
  handleOnBlur: () => void;
  handleOnChange: (value: string) => void;
  id: string;
  label: string;
  name: string;
  placeholder: string;
  disabled?: boolean;
  errorMessage?: string;
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
 * @param handleOnBlur required
 * @param handleOnChange required
 * @param id required - will be used for the input id and the htmlFor on the label
 * @param label required - string for the label
 * @param name required
 * @param placeholder required to get nice animation effect with label
 * @returns an input, label, conditional password view/hide icon, error message all wrapped in a div
 */
export const TextInput = ({
  autofocus,
  disabled,
  errorMessage,
  handleOnBlur,
  handleOnChange,
  label,
  id,
  minlength,
  maxlength,
  name,
  pattern,
  placeholder,
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
    <div className='relative flex flex-col w-full min-h-[105px] cursor-default'>
      <input
        autoFocus={autofocus ?? false}
        className={`peer bg-transparent py-2 border-b-2 mb-7 border-thunder-500 mt-1 text-xl placeholder-transparent
        focus:outline-none focus:border-b-2 focus:border-outer-space-400 [&:not(:focus)]:invalid:border-red-900
        disabled:bg-slate-300 disabled:text-slate-500 disabled:cursor-not-allowed
        [&:not(:focus)]:invalid:text-red-900 [&:not(:focus)]:invalid:dark:text-red-200
        dark:disabled:bg-slate-500 dark:disabled:text-slate-300 dark:[&:not(:focus)]:invalid:border-red-300
        `}
        data-testid='text-input'
        disabled={disabled}
        id={id}
        maxLength={maxlength}
        minLength={minlength}
        name={name}
        onBlur={handleOnBlur}
        onChange={(e: ChangeEvent<HTMLInputElement>) => handleOnChange(e.target.value)}
        pattern={pattern}
        placeholder={placeholder}
        required={required}
        type={displayType ?? 'text'}
        value={value}
      />
      <label
        className={`absolute transition-all left-0 -top-3 cursor-pointer text-base
        peer-placeholder-shown:text-xl peer-placeholder-shown:top-3.5 peer-focus:-top-3 peer-focus:text-base
        peer-disabled:text-transparent peer-disabled:cursor-default`}
        htmlFor={id}
      >
        {label}
      </label>
      {type === 'password' && (
        <button
          aria-label='toggle view/hide password'
          className='absolute top-3 right-4'
          onClick={() => setIsPasswordShowing(!isPasswordShowing)}
          type='button'
        >
          {isPasswordShowing ? <FaSolidEye width={20} /> : <FaEyeSlash width={20} />}
        </button>
      )}
      {errorMessage && (
        <p className='relative -top-7 font-semibold pt-1 text-red-900 text-sm dark:text-red-200'>
          {errorMessage}
        </p>
      )}
    </div>
  );
};
