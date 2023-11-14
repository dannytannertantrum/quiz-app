import '@testing-library/jest-dom';

import { renderWithAuth, screen, testAuthProviderProps } from 'custom-rtl';
import { Account } from '../../../app/components/organisms/Account';
import { quizTestData } from '../../../test-utils/shared-data';

describe('Account', () => {
  test('loads and displays an Account organism', () => {
    renderWithAuth(<Account quizzes={[quizTestData]} />);

    expect(screen.getByText(testAuthProviderProps.userState.data.email)).toBeInTheDocument();
    expect(screen.getByText('Sign out')).toBeInTheDocument();
  });
});
