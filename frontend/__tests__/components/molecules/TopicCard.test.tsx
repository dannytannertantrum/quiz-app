import '@testing-library/jest-dom';

import { render, screen } from 'custom-rtl';
import { TopicCard } from '../../../app/components/molecules/TopicCard';

describe('TopicCard', () => {
  test('loads and displays a topic card', () => {
    render(
      <TopicCard
        title='Movies'
        description='I scream you scream we all scream for the Ice Cream Man'
        color='emerald'
      />
    );

    expect(screen.getByText('Movies')).toBeInTheDocument();
    expect(screen.getByText(/we all scream/)).toBeInTheDocument();
  });
});
