import '@testing-library/jest-dom';

import { primaryTopicsTestData } from '../../../test-utils/shared-data';
import { render, screen } from 'custom-rtl';
import { TopicList } from '../../../app/components/organisms/TopicList';

describe('TopicCard', () => {
  test('loads and displays the component', () => {
    render(<TopicList primaryTopics={primaryTopicsTestData} />);

    expect(screen.getByText('Movies')).toBeInTheDocument();
    expect(screen.getByText('Sportsball')).toBeInTheDocument();
    expect(screen.getByText('Music')).toBeInTheDocument();
    expect(screen.getByText(/This is a long topic title/)).toBeInTheDocument();
  });
});
