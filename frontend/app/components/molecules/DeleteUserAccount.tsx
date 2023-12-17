'use client';

import { Fragment, useContext, useState } from 'react';

import { AuthContext } from '../../context/AuthContext';
import { Button } from '../atoms/Button';
import { Fieldset } from '../atoms/Fieldset';
import { RadioButton } from '../atoms/RadioButton';

const defaultError = 'Please make a selection';

// We could use state, but native HTML provides a modal out of the box
// https://developer.mozilla.org/en-US/docs/Web/HTML/Element/dialog
const handleToggleModal = (toggle: 'open' | 'close') => {
  const modal = document.querySelector('dialog');
  toggle === 'open' ? modal?.showModal() : modal?.close();
};

export const DeleteUserAccount = () => {
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState(defaultError);
  const { deleteAccount, userState } = useContext(AuthContext);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);
    const formDataArray = Object.values(Object.fromEntries(formData.entries()));

    if (formDataArray.length === 0) {
      setErrorMessage(defaultError);
      setError(true);
      return;
    }

    try {
      const isHardDelete = formDataArray[0] === 'hard';
      await deleteAccount(isHardDelete);
    } catch (reason: unknown) {
      console.error('There was a problem deleting the account: ', reason);
      setErrorMessage(
        'There was a network error trying to delete your account; please refresh the page and try again.'
      );
    }
  };

  return (
    <Fragment>
      <Button onClick={() => handleToggleModal('open')} secondary styles={{ marginBottom: '1rem' }}>
        Delete account
      </Button>
      <dialog
        className={`w-full p-7 bg-thunder-200 border rounded-xl border-thunder-800 shadow-lg shadow-thunder-500
      dark:bg-thunder-950 dark:border-thunder-300 dark:shadow-thunder-800 backdrop:bg-outer-space-500 backdrop:opacity-40
        md:w-[600px] md:border`}
      >
        <form method='dialog' onSubmit={handleSubmit}>
          <Fieldset
            legend='Please select account removal method'
            legendSize='small'
            disabled={userState?.isLoading}
          >
            <RadioButton
              handleChange={() => setError(false)}
              id='hardDelete'
              value='hard'
              name='deletion'
              label='Fully delete and destroy my records from your system'
            />
            <RadioButton
              handleChange={() => setError(false)}
              id='softDelete'
              value='soft'
              name='deletion'
              label='Deactivate my account in case I want to return'
            />
            <div className='flex justify-between'>
              <Button type='submit'>Submit</Button>
              <Button onClick={() => handleToggleModal('close')} secondary>
                Cancel
              </Button>
            </div>
            {error && <p className='pt-5 text-rose-900 dark:text-rose-300'>{errorMessage}</p>}
          </Fieldset>
        </form>
      </dialog>
    </Fragment>
  );
};
