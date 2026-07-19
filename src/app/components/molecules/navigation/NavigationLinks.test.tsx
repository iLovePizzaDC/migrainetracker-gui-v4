import NavigationLinks from '@/app/components/molecules/navigation/NavigationLinks';
import { useUser } from '@/shared/hooks/user/use-user';
import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/shared/hooks/user/use-user');
vi.mock('react-router-dom', () => ({
  useLocation: () => ({ pathname: '/' }),
  Link: ({ children, href, onClick }: any) => (
    <a href={href} onClick={onClick}>
      {children}
    </a>
  ),
}));
vi.mock('@/app/constants/navigation/links', () => ({
  NAVIGATION_LINKS: [
    { label: 'Public', to: '/public', allowAnonymous: true },
    { label: 'Private', to: '/private', allowAnonymous: false },
  ],
}));

describe('<NavigationLinks />', () => {
  beforeEach(() => {
    vi.mocked(useUser).mockReturnValue({ user: null } as any);
  });

  it('renders anonymous true links when user is null', () => {
    render(<NavigationLinks />);

    expect(screen.getByText('Public')).toBeInTheDocument();
    expect(screen.queryByText('Private')).not.toBeInTheDocument();
  });

  it('renders anonymous true links when user is set', () => {
    vi.mocked(useUser).mockReturnValue({
      user: { given_name: 'John' },
    } as any);
    render(<NavigationLinks />);

    expect(screen.getByText('Public')).toBeInTheDocument();
  });

  it('renders anonymous false links when user is set', () => {
    vi.mocked(useUser).mockReturnValue({
      user: { given_name: 'John' },
    } as any);
    render(<NavigationLinks />);

    expect(screen.getByText('Private')).toBeInTheDocument();
  });

  it('does not render anonymous false links when user is null', () => {
    render(<NavigationLinks />);

    expect(screen.queryByText('Private')).not.toBeInTheDocument();
  });
});
