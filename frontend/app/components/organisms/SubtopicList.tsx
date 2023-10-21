'use client';

import { Fragment, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { BASE_CLIENT_URL } from '../../utils/constants';
import { BaseTopicData } from '../../types/topics';
import { Button } from '../atoms/Button';
import { Checkbox } from '../molecules/Checkbox';
import { createQuiz } from '../../api/quizzes';
import { CreateQuizDataRequest, CreateQuizDataResponse } from '../../types/quizzes';
import { Fieldset } from '../atoms/Fieldset';
import { QuizLoader } from '../atoms/QuizLoader';
import { RequestLoader } from '../atoms/RequestLoader';
import { ResponseSuccess } from '../../utils/commonTypes';

interface SubtopicListState {
  animationEnd: boolean;
  error: boolean;
  formTouched: boolean;
  isLoading: boolean;
  showRequestLoader: boolean;
  quizQuestions?: ResponseSuccess<CreateQuizDataResponse>;
}

const initialSubtopicListState: SubtopicListState = {
  animationEnd: false,
  error: false,
  formTouched: false,
  isLoading: false,
  showRequestLoader: false,
  quizQuestions: undefined,
};

export const SubtopicList = ({
  parentTopicTitle,
  subtopics,
}: {
  parentTopicTitle: BaseTopicData['title'];
  subtopics: BaseTopicData[];
}) => {
  const [state, setState] = useState(initialSubtopicListState);
  const router = useRouter();
  let checkboxNodes: NodeListOf<HTMLInputElement> | null = null;
  let checkboxes: HTMLInputElement[] = [];

  useEffect(() => {
    if (state.animationEnd && state.quizQuestions) {
      router.push(`${BASE_CLIENT_URL}/quizzes/${state.quizQuestions.data.id}`);
    }
  }, [router, state.animationEnd, state.quizQuestions]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setState((prevState) => ({ ...prevState, formTouched: true }));

    const form = event.currentTarget;
    const formData = new FormData(form);
    const selectedSubtopics: CreateQuizDataRequest = {
      selected_topics: Object.values(Object.fromEntries(formData.entries())),
    };
    if (selectedSubtopics.selected_topics.length < 1) {
      setState((prevState) => ({ ...prevState, error: true }));
      return;
    } else {
      setState((prevState) => ({ ...prevState, error: false }));
    }

    const selectedSubtopicUuids = JSON.stringify(selectedSubtopics);

    if (!state.error) {
      try {
        setState((prevState) => ({ ...prevState, isLoading: true }));
        const response = await createQuiz(form.method, selectedSubtopicUuids);
        if (!(response instanceof Error)) {
          setState((prevState) => ({
            ...prevState,
            isLoading: false,
            showRequestLoader: true,
            quizQuestions: response,
          }));
        }
      } catch (reason: unknown) {
        setState((prevState) => ({ ...prevState, isLoading: false }));
        console.error('There was a problem creating your quiz: ', reason);
      }
    }
  };

  const handleCheckboxChange = () => {
    setState((prevState) => ({ ...prevState, formTouched: true }));

    if (checkboxNodes === null) {
      checkboxNodes = document.querySelectorAll('input[type="checkbox"]');
      checkboxes = Array.from(checkboxNodes);
    }
    const someCheckboxesChecked = checkboxes.some((box: HTMLInputElement) => box.checked);

    if (state.formTouched && someCheckboxesChecked) {
      setState((prevState) => ({ ...prevState, error: false }));
    } else if (!someCheckboxesChecked) {
      setState((prevState) => ({ ...prevState, error: true }));
    }
  };

  if (state.showRequestLoader) {
    return (
      <Fragment>
        <h2 className='text-2xl text-center -mb-10 md:text-3xl'>
          Please wait while we create your quiz!
        </h2>
        <RequestLoader
          handleAnimationEnd={() => setState((prevState) => ({ ...prevState, animationEnd: true }))}
        />
      </Fragment>
    );
  }

  return (
    <Fragment>
      <h2 className='text-3xl'>
        Select subtopics for <span className='capitalize'>{parentTopicTitle}</span>
      </h2>
      <form
        autoComplete='off'
        method='post'
        onSubmit={handleSubmit}
        className={`w-full bg-thunder-200 border rounded-xl border-thunder-800 p-7 shadow-lg shadow-thunder-500
      dark:bg-thunder-950 dark:border-thunder-300 dark:shadow-thunder-800 md:w-[500px] 
      ${state.error ? '!border-rose-900 dark:!border-rose-300' : ''}`}
        noValidate
      >
        <Fieldset disabled={state.isLoading}>
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
          <Button type='submit'>{state.isLoading ? <QuizLoader center /> : 'Submit'}</Button>
          {state.error && (
            <p className='pt-5 text-rose-900 dark:text-rose-300'>
              Please select at least one topic
            </p>
          )}
        </Fieldset>
      </form>
      <Link
        href={'/topics'}
        className='bg-transparent underline text-outer-space-900 text-xl hover:text-outer-space-1000
  dark:text-outer-space-300 dark:hover:text-outer-space-200 transition-colors'
      >
        {'< '}Back to topics
      </Link>
    </Fragment>
  );
};
