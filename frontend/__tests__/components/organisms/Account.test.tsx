import '@testing-library/jest-dom';

import { renderWithAuth, screen, testAuthProviderProps } from 'custom-rtl';
import { Account } from '../../../app/components/organisms/Account';
import { quizTestData } from '../../../test-utils/shared-data';

describe('Account', () => {
  beforeEach(() => {
    renderWithAuth(<Account quizzes={[quizTestData]} />);
  });

  test('loads and displays an Account organism', () => {
    expect(screen.getByText(testAuthProviderProps.userState.data.email)).toBeInTheDocument();
    expect(screen.getByText('Sign out')).toBeInTheDocument();
  });

  test('loads and displays quiz data', () => {
    expect(screen.getByText('Topic')).toBeInTheDocument();
    expect(screen.getByText('Subtopics')).toBeInTheDocument();
    expect(screen.getByText('Completed')).toBeInTheDocument();
    expect(screen.getByText('Score')).toBeInTheDocument();
    expect(screen.getByText('Review')).toBeInTheDocument();
    expect(screen.getByText(quizTestData.primary_topic)).toBeInTheDocument();
    expect(screen.getByText(`${quizTestData.score}%`)).toBeInTheDocument();
  });

  test('correctly parses the subtopics', () => {
    expect(screen.getByText('comedy, drama')).toBeInTheDocument();
  });

  test('correctly parses completed_at date', () => {
    expect(screen.getByText('Nov 11, 2023')).toBeInTheDocument();
  });
});
