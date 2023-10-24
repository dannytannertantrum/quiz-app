import { useCallback } from 'react';

export interface CheckboxProps {
  id: string;
  name: string;
  value: string;
  handleChange?: () => void;
}

/**
 *
 * @param id must be unique to set the id of the input and htmlFor attr of the label
 * @param name is the text you want displayed to the user
 * @param name is the uuid so we can easily access it from the form
 * @returns
 */
export const Checkbox = ({ id, name, handleChange, value }: CheckboxProps) => {
  // Prevent the form from being submitted on Enter and
  // enable toggling value with keyboard input
  const handleOnKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === 'Enter') {
        event.preventDefault();
        event.currentTarget.checked === true
          ? (event.currentTarget.checked = false)
          : (event.currentTarget.checked = true);

        handleChange && handleChange();
      }
    },
    [handleChange]
  );

  return (
    <label className='capitalize text-2xl cursor-pointer' htmlFor={id}>
      <input
        className='mr-4 h-5 w-5 accent-current cursor-pointer'
        id={id}
        name={name}
        onChange={handleChange}
        onKeyDown={handleOnKeyDown}
        type='checkbox'
        value={value}
      />
      {name}
    </label>
  );
};
