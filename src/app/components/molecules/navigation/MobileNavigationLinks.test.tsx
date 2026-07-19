import MobileNavigationLinks from '@/app/components/molecules/navigation/MobileNavigationLinks';
import { NAVIGATION_LINKS } from '@/app/constants/navigation/links';
import { useUser } from '@/shared/hooks/user/use-user';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
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

describe('<MobileNavigationLinks />', () => {
  const user = userEvent.setup();
  const defaultProps = { toggleMenu: vi.fn() };

  beforeEach(() => {
    vi.mocked(useUser).mockReturnValue({ user: null } as any);
  });

  it('renders anonymous true links when user is null', () => {
    render(<MobileNavigationLinks {...defaultProps} />);

    expect(screen.getByText('Public')).toBeInTheDocument();
    expect(screen.queryByText('Private')).not.toBeInTheDocument();
  });

  it('renders anonymous true links when user is set', () => {
    vi.mocked(useUser).mockReturnValue({
      user: { given_name: 'John' },
    } as any);
    render(<MobileNavigationLinks {...defaultProps} />);

    expect(screen.getByText('Public')).toBeInTheDocument();
  });

  it('renders anonymous false links when user is set', () => {
    vi.mocked(useUser).mockReturnValue({
      user: { given_name: 'John' },
    } as any);
    render(<MobileNavigationLinks {...defaultProps} />);

    expect(screen.getByText('Private')).toBeInTheDocument();
  });

  it('does not render anonymous false links when user is null', () => {
    render(<MobileNavigationLinks {...defaultProps} />);

    expect(screen.queryByText('Private')).not.toBeInTheDocument();
  });

  it('calls toggleMenu when a link is clicked', async () => {
    const mockToggleMenu = vi.fn();
    render(<MobileNavigationLinks toggleMenu={mockToggleMenu} />);

    await user.click(screen.getByText(NAVIGATION_LINKS[0].label));

    expect(mockToggleMenu).toHaveBeenCalled();
  });
});
