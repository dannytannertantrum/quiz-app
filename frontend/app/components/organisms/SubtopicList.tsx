'use client';

import { useState } from 'react';

import { BaseTopicData } from '../../types/topics';
import { Button } from '../atoms/Button';
import { Checkbox } from '../molecules/Checkbox';
import { Fieldset } from '../atoms/Fieldset';
import { createQuiz } from '../../api/quizzes';
import { CreateQuizDataRequest } from '@/types/quizzes';

export const SubtopicList = ({ subtopics }: { subtopics: BaseTopicData[] }) => {
  const [error, setError] = useState(false);
  const [formTouched, setFormTouched] = useState(false);
  let checkboxNodes: NodeListOf<HTMLInputElement> | null = null;
  let checkboxes: HTMLInputElement[] = [];

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    setFormTouched(true);
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);
    const selectedSubtopics: CreateQuizDataRequest = {
      selected_topics: Object.values(Object.fromEntries(formData.entries())),
    };
    if (selectedSubtopics.selected_topics.length < 1) {
      setError(true);
      return;
    } else {
      setError(false);
    }

    const selectedSubtopicUuids = JSON.stringify(selectedSubtopics);

    if (!error) {
      const result = await createQuiz(form.method, selectedSubtopicUuids);
      console.log('result', result);
    }
  };

  const handleCheckboxChange = () => {
    setFormTouched(true);

    if (checkboxNodes === null) {
      checkboxNodes = document.querySelectorAll('input[type="checkbox"]');
      checkboxes = Array.from(checkboxNodes);
    }
    const someCheckboxesChecked = checkboxes.some((box: HTMLInputElement) => box.checked);

    if (formTouched && someCheckboxesChecked) {
      setError(false);
    } else if (!someCheckboxesChecked) {
      setError(true);
    }
  };

  return (
    <form
      autoComplete='off'
      method='post'
      onSubmit={handleSubmit}
      className={`w-full bg-thunder-200 border rounded-xl border-thunder-800 p-7 shadow-lg shadow-thunder-500
      dark:bg-thunder-950 dark:border-thunder-300 dark:shadow-thunder-800 md:w-[500px] 
      ${error ? '!border-rose-900 dark:!border-rose-300' : ''}`}
      noValidate
    >
      <Fieldset disabled={false}>
        <ul>
          {subtopics.map((topic) => (
            <li className='mb-4' key={topic.id}>
              <Checkbox
                id={topic.title}
                name={topic.title}
                handleChange={handleCheckboxChange}
                value={topic.id}
              />
            </li>
          ))}
        </ul>
        <Button type='submit'>Submit</Button>
        {error && (
          <p className='pt-5 text-rose-900 dark:text-rose-300'>Please select at least one topic</p>
        )}
      </Fieldset>
    </form>
  );
};
