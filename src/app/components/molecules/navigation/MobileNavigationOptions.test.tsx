import MobileNavigationOptions from '@/app/components/molecules/navigation/MobileNavigationOptions';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

describe('<MobileNavigationOptions />', () => {
  const user = userEvent.setup();
  const defaultProps = { toggleMenu: vi.fn(), isOpen: false };

  it('renders toggle button', () => {
    render(<MobileNavigationOptions {...defaultProps} />);

    expect(screen.getByTestId('mobile-nav-toggle')).toBeInTheDocument();
  });

  it('calls toggleMenu on click', async () => {
    const mockToggleMenu = vi.fn();

    render(<MobileNavigationOptions {...defaultProps} toggleMenu={mockToggleMenu} />);

    await user.click(screen.getByTestId('mobile-nav-toggle'));

    expect(mockToggleMenu).toHaveBeenCalledOnce();
  });

  it('renders XMarkIcon when isOpen is true', () => {
    render(<MobileNavigationOptions {...defaultProps} isOpen={true} />);

    expect(screen.getByTestId('close-icon')).toBeInTheDocument();
  });

  it('renders Bars3Icon when isOpen is false', () => {
    render(<MobileNavigationOptions {...defaultProps} isOpen={false} />);

    expect(screen.getByTestId('open-icon')).toBeInTheDocument();
  });
});
