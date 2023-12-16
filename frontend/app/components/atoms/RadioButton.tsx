'use client';

interface RadioButtonProps {
  id: string;
  label: string;
  name: string;
  value: string;
}

/**
 *
 * @param id used for htmlFor on the label and id of the input
 * @param label the string of text displayed to the user
 * @param name radio group name
 * @param value the individual radio button's value attribute
 * @returns
 */
export const RadioButton = ({ id, label, name, value }: RadioButtonProps) => {
  // Prevent the form from accidental submission on Enter
  const handleOnKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      event.currentTarget.checked = true;
    }
  };

  return (
    <label htmlFor={id} className='flex items-baseline text-lg mb-3 cursor-pointer'>
      <input
        type='radio'
        id={id}
        onKeyDown={handleOnKeyDown}
        value={value}
        name={name}
        className={`mr-3 cursor-pointer appearance-none rounded-full w-4 h-4 border transition-all ease-linear relative [top:2px]
      border-thunder-800 dark:border-thunder-300 checked:border-4 checked:border-thunder-800 dark:checked:border-thunder-300`}
      />
      {label}
    </label>
  );
};
