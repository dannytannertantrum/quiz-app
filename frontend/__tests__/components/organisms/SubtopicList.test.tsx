import '@testing-library/jest-dom';

import { subtopicsTestData } from '../../../test-utils/shared-data';
import { render, screen } from 'custom-rtl';
import { SubtopicList } from '../../../app/components/organisms/SubtopicList';

describe('SubtopicList', () => {
  test('loads and displays a list of subtopics', () => {
    render(<SubtopicList subtopics={subtopicsTestData} />);

    expect(screen.getByText('comedy')).toBeInTheDocument();
    expect(screen.getByText('drama')).toBeInTheDocument();
    expect(screen.getByText('horror')).toBeInTheDocument();
    expect(screen.getByText('sci-fi')).toBeInTheDocument();
  });
});
