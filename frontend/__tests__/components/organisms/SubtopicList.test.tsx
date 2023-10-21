import '@testing-library/jest-dom';
import { useRouter } from 'next/navigation';

import { subtopicsTestData } from '../../../test-utils/shared-data';
import { render, renderWithUserEvent, screen, waitFor } from 'custom-rtl';
import { SubtopicList } from '../../../app/components/organisms/SubtopicList';

describe('SubtopicList', () => {
  test('loads and displays a list of subtopics', () => {
    render(<SubtopicList parentTopicTitle='movies' subtopics={subtopicsTestData} />);

    expect(screen.getByText('comedy')).toBeInTheDocument();
    expect(screen.getByText('drama')).toBeInTheDocument();
    expect(screen.getByText('horror')).toBeInTheDocument();
    expect(screen.getByText('sci-fi')).toBeInTheDocument();
  });

  test('displays the parent topic title', () => {
    render(<SubtopicList parentTopicTitle='movies' subtopics={subtopicsTestData} />);

    expect(screen.getByText('movies')).toBeInTheDocument();
  });

  test('error message displays when user tries to submit the form without info', async () => {
    const { user } = renderWithUserEvent(
      <SubtopicList parentTopicTitle='movies' subtopics={subtopicsTestData} />
    );
    const submitButton = screen.getByText('Submit');

    await user.click(submitButton);

    expect(screen.getByText('Please select at least one topic')).toBeInTheDocument();
  });

  test('error message goes away after clicking a checkbox', async () => {
    const { user } = renderWithUserEvent(
      <SubtopicList parentTopicTitle='movies' subtopics={subtopicsTestData} />
    );
    const submitButton = screen.getByText('Submit');
    const dramaLabel = screen.getByText('drama');

    await user.click(submitButton);
    expect(screen.getByText('Please select at least one topic')).toBeInTheDocument();

    await user.click(dramaLabel);
    expect(screen.queryByText('Please select at least one topic')).not.toBeInTheDocument();
  });

  test('request loader only displays after the form is submitted', async () => {
    const { user } = renderWithUserEvent(
      <SubtopicList parentTopicTitle='movies' subtopics={subtopicsTestData} />
    );
    const submitButton = screen.getByText('Submit');
    const dramaLabel = screen.getByText('drama');

    expect(screen.queryByText('Please wait while we create your quiz!')).not.toBeInTheDocument();

    await user.click(dramaLabel);
    await user.click(submitButton);

    waitFor(() => {
      expect(useRouter().push).toHaveBeenCalled();
      expect(screen.getByText('Please wait while we create your quiz!')).toBeInTheDocument();
    });
  });
});
