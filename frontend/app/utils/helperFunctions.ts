'use client';

import { BaseUserData } from '../types/users';

export const checkForDuplicateEmail = (
  emails: BaseUserData['email'][],
  newUserEmail: string
): boolean => {
  /*
    If this were a real application with millions of users,
    a Set would be much more efficient over an array method like includes
    We optimized on the backend by only returning a list of emails,
    rather than a list of dictionaries with "email" keys that we'd have to map through
  */
  const emailSet = new Set(emails);
  return emailSet.has(newUserEmail);
};

export const transformDate = (dateString?: string): string => {
  const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const date = new Date(dateString ?? '');
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    timeZone: userTimezone,
  });
};

export const parseSubtopics = (subtopics: string[]): string => {
  return subtopics.join(', ');
};
