import '@testing-library/jest-dom';

import { renderWithAuth, renderWithUserEvent, screen, testAuthProviderProps } from 'custom-rtl';
import { Account } from '../../../app/components/organisms/Account';
import { quizTestData } from '../../../test-utils/shared-data';

describe('Account', () => {
  describe('general', () => {
    beforeEach(() => {
      renderWithAuth(<Account quizzes={[quizTestData]} />);
    });

    test('loads and displays an Account organism', () => {
      expect(screen.getByText(testAuthProviderProps.userState.data.email)).toBeInTheDocument();
      expect(screen.getByText('Sign out')).toBeInTheDocument();
      expect(screen.getByText('User Info')).toBeInTheDocument();
      expect(screen.getByText('Quiz History')).toBeInTheDocument();
      expect(screen.getByText('Manage Account')).toBeInTheDocument();
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

  // This test is necessary because without updating tabindexes to -1, the keyboard navigation
  // would seemingly disappear when tabbing from "Quiz History" to "Manage Account"
  describe('correct keyboard navigation tabbing behavior', () => {
    test('when accordions are shut, they correctly tab to the next accordion', async () => {
      const { user } = renderWithUserEvent(<Account quizzes={[quizTestData]} />);
      const quizHistory: HTMLButtonElement = screen.getByText('Quiz History');
      await user.click(quizHistory); // open
      await user.click(quizHistory); // shut
      await user.tab();

      expect(screen.getByText('Manage Account').parentElement).toHaveFocus();
    });

    test('when quiz history accordion is open, it correctly tabs to the first link for review', async () => {
      const { user } = renderWithUserEvent(<Account quizzes={[quizTestData]} />);
      const quizHistory: HTMLButtonElement = screen.getByText('Quiz History');
      await user.click(quizHistory); // open
      await user.tab();

      expect(screen.getByText('Link')).toHaveFocus();
    });
  });
});
