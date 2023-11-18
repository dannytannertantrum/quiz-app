import {
  checkForDuplicateEmail,
  parseSubtopics,
  transformDate,
} from '../../app/utils/helperFunctions';

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

  describe('parseSubtopics', () => {
    test('correctly parses subtopics into a comma separated string', () => {
      const subtopics = ['hockey', 'football', 'baseball', 'basketball'];
      const result = parseSubtopics(subtopics);

      expect(result).toBe('hockey, football, baseball, basketball');
    });
  });

  describe('transformDate', () => {
    test('correctly transforms a date string into a readable format', () => {
      const result = transformDate('2023-11-11T23:58:19.913201Z');

      expect(result).toBe('Nov 11, 2023');
    });
  });
});
