import { checkForDuplicateEmail } from '../../app/utils/helperFunctions';

describe('Helper functions', () => {
  describe('checkForDuplicateEmail', () => {
    test('returns true if there is a matching email', () => {
      const emails = ['user@example.com', 'test@test.net', 'another@thing.org'];
      const userInputEmail = 'another@thing.org';

      const result = checkForDuplicateEmail(emails, userInputEmail);

      expect(result).toBeTruthy();
    });

    test('returns false if there is not a matching email', () => {
      const emails = ['user@example.com', 'test@test.net', 'another@thing.org'];
      const userInputEmail = 'new@example.com';

      const result = checkForDuplicateEmail(emails, userInputEmail);

      expect(result).toBeFalsy();
    });
  });
});
