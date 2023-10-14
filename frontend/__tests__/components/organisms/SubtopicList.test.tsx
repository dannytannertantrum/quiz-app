import '@testing-library/jest-dom';

import { subtopicsTestData } from '../../../test-utils/shared-data';
import { render, renderWithUserEvent, screen } from 'custom-rtl';
import { SubtopicList } from '../../../app/components/organisms/SubtopicList';

describe('SubtopicList', () => {
  test('loads and displays a list of subtopics', () => {
    render(<SubtopicList subtopics={subtopicsTestData} />);

    expect(screen.getByText('comedy')).toBeInTheDocument();
    expect(screen.getByText('drama')).toBeInTheDocument();
    expect(screen.getByText('horror')).toBeInTheDocument();
    expect(screen.getByText('sci-fi')).toBeInTheDocument();
  });

  test('error message displays when user tries to submit the form without info', async () => {
    const { user } = renderWithUserEvent(<SubtopicList subtopics={subtopicsTestData} />);
    const submitButton = screen.getByText('Submit');

    await user.click(submitButton);

    expect(screen.getByText('Please select at least one topic')).toBeInTheDocument();
  });
});
