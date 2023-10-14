export interface CheckboxProps {
  id: string;
  name: string;
}

/**
 *
 * @param id must be unique to set the id of the input and htmlFor attr of the label
 * @param name is the text you want displayed to the user
 * @returns
 */
export const Checkbox = ({ id, name }: CheckboxProps) => {
  return (
    <label className='text-2xl cursor-pointer' htmlFor={id}>
      <input className='mr-2 h-5 w-5 accent-current' type='checkbox' id={id} name={name} />
      {name}
    </label>
  );
};
