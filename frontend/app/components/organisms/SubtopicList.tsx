'use client';

import { BaseTopicData } from '../../types/topics';
import { Button } from '../atoms/Button';
import { Fieldset } from '../atoms/Fieldset';
import { Checkbox } from '../molecules/Checkbox';

/*
- Move list into SubtopicList - DONE
- Get all subtopics on the page in Checkbox form - DONE
- Style the background the same as the authform - DONE
- COMMIT before adding functionality - DONE
- Wire up the form
  - Add form element
  - Add fieldset
  - Add submit button
  - log out data for now
  - Add validation
    - Cannot submit form without checking anything
    - (add error message) Do not put error message there until form touched
    - When clicking submit, add "disabled" to fieldset
*/

export const SubtopicList = ({ subtopics }: { subtopics: BaseTopicData[] }) => {
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    console.log('submitted!');
  };

  return (
    <form
      autoComplete='off'
      method='put'
      onSubmit={handleSubmit}
      className={`w-full bg-thunder-200 border-y border-thunder-800 p-7 shadow-lg shadow-thunder-500
    dark:bg-thunder-950 dark:border-thunder-300 dark:shadow-thunder-800
    md:w-[500px] md:border md:rounded-xl`}
      noValidate
    >
      <Fieldset disabled={false}>
        <ul>
          {subtopics.map((topic) => (
            <li className='mb-4' key={topic.id}>
              <Checkbox id={topic.title} name={topic.title} />
            </li>
          ))}
        </ul>
        <Button type='submit'>Submit</Button>
      </Fieldset>
    </form>
  );
};
