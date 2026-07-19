import DropdownInput from '@/shared/components/atoms/DropdownInput';
import { useClickOutside } from '@/shared/hooks/use-click-outside';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/shared/hooks/use-click-outside');

const mockOptions = [
  { label: 'Apple', value: 'apple' },
  { label: 'Banana', value: 'banana' },
  { label: 'Cherry', value: 'cherry' },
];

describe('<DropdownInput />', () => {
  const user = userEvent.setup();
  const defaultProps = {
    id: 'test-dropdown',
    label: 'Fruit',
    value: 'apple',
    options: mockOptions,
    onChange: vi.fn(),
  };

  beforeEach(() => {
    vi.mocked(useClickOutside).mockImplementation(() => { });
  });

  afterEach(() => vi.clearAllMocks());

  describe('rendering', () => {
    it('renders label', () => {
      render(<DropdownInput {...defaultProps} />);

      expect(screen.getByText('Fruit')).toBeInTheDocument();
    });

    it('renders trigger button with current value label', () => {
      render(<DropdownInput {...defaultProps} />);

      expect(screen.getByTestId('dropdown-menu-trigger')).toHaveTextContent('Apple');
    });

    it('renders "Select..." when value matches no option', () => {
      render(<DropdownInput {...defaultProps} value='unknown' />);

      expect(screen.getByTestId('dropdown-menu-trigger')).toHaveTextContent('Select...');
    });

    it('hidden input has correct value', () => {
      render(<DropdownInput {...defaultProps} />);

      expect(screen.getByRole('textbox', { hidden: true })).toHaveValue('apple');
    });

    it('hidden input is required when required prop is set', () => {
      render(<DropdownInput {...defaultProps} required />);

      expect(screen.getByRole('textbox', { hidden: true })).toBeRequired();
    });

    it('renders all options when dropdown is open', async () => {
      render(<DropdownInput {...defaultProps} />);

      await user.click(screen.getByTestId('dropdown-menu-trigger'));

      expect(screen.getByTestId('apple')).toBeInTheDocument();
      expect(screen.getByTestId('banana')).toBeInTheDocument();
      expect(screen.getByTestId('cherry')).toBeInTheDocument();
    });
  });

  describe('disabled state', () => {
    it('disables trigger button when disabled prop is true', () => {
      render(<DropdownInput {...defaultProps} disabled />);

      expect(screen.getByTestId('dropdown-menu-trigger')).toBeDisabled();
    });

    it('disables hidden input when disabled prop is true', () => {
      render(<DropdownInput {...defaultProps} disabled />);

      expect(screen.getByRole('textbox', { hidden: true })).toBeDisabled();
    });

    it('does not open dropdown when disabled', async () => {
      render(<DropdownInput {...defaultProps} disabled />);

      await user.click(screen.getByTestId('dropdown-menu-trigger'));

      expect(screen.queryByTestId('banana')).not.toBeInTheDocument();
    });
  });

  describe('dropdown open/close', () => {
    it('opens dropdown on trigger click', async () => {
      render(<DropdownInput {...defaultProps} />);

      await user.click(screen.getByTestId('dropdown-menu-trigger'));

      expect(screen.getByTestId('banana')).toBeInTheDocument();
      expect(screen.getByTestId('cherry')).toBeInTheDocument();
    });

    it('closes dropdown on second trigger click', async () => {
      render(<DropdownInput {...defaultProps} />);

      await user.click(screen.getByTestId('dropdown-menu-trigger'));
      await user.click(screen.getByTestId('dropdown-menu-trigger'));

      expect(screen.queryByTestId('banana')).not.toBeInTheDocument();
    });

    it('closes dropdown when clicking outside via useClickOutside callback', async () => {
      let clickOutsideCallback: () => void = () => { };

      vi.mocked(useClickOutside).mockImplementation((_, callback: () => void) => {
        clickOutsideCallback = callback;
      });

      render(<DropdownInput {...defaultProps} />);

      await user.click(screen.getByTestId('dropdown-menu-trigger'));
      expect(screen.getByTestId('banana')).toBeInTheDocument();

      clickOutsideCallback();

      await waitFor(() => {
        expect(screen.queryByTestId('banana')).not.toBeInTheDocument();
      });
    });
  });

  describe('selection', () => {
    it('calls onChange with selected value', async () => {
      const mockOnChange = vi.fn();

      render(<DropdownInput {...defaultProps} onChange={mockOnChange} />);

      await user.click(screen.getByTestId('dropdown-menu-trigger'));
      await user.click(screen.getByTestId('banana'));

      expect(mockOnChange).toHaveBeenCalledWith('banana');
    });

    it('closes dropdown after selection', async () => {
      render(<DropdownInput {...defaultProps} />);

      await user.click(screen.getByTestId('dropdown-menu-trigger'));
      await user.click(screen.getByTestId('banana'));

      expect(screen.queryByTestId('cherry')).not.toBeInTheDocument();
    });

    it('highlights the currently selected option', async () => {
      render(<DropdownInput {...defaultProps} value='banana' />);

      await user.click(screen.getByTestId('dropdown-menu-trigger'));

      expect(screen.getByTestId('banana')).toHaveClass('bg-white/20');
      expect(screen.getByTestId('apple')).not.toHaveClass('bg-white/20');
    });

    it('calls onChange only once per selection', async () => {
      const mockOnChange = vi.fn();

      render(<DropdownInput {...defaultProps} onChange={mockOnChange} />);

      await user.click(screen.getByTestId('dropdown-menu-trigger'));
      await user.click(screen.getByTestId('banana'));

      expect(mockOnChange).toHaveBeenCalledTimes(1);
    });
  });

  describe('menu positioning', () => {
    it('calculates menu position based on button bounds', async () => {
      render(<DropdownInput {...defaultProps} />);

      await user.click(screen.getByTestId('dropdown-menu-trigger'));

      const menu = screen.getByRole('list');
      const button = screen.getByTestId('dropdown-menu-trigger');
      const buttonRect = button.getBoundingClientRect();

      expect(menu).toHaveStyle({
        position: 'fixed',
        top: `${buttonRect.bottom + 4}px`,
        left: `${buttonRect.left}px`,
        width: `${buttonRect.width}px`,
      });
    });
  });

  describe('event listeners', () => {
    it('sets up useClickOutside with button and menu refs', () => {
      render(<DropdownInput {...defaultProps} />);

      expect(vi.mocked(useClickOutside)).toHaveBeenCalled();
    });

    it('passes callback to useClickOutside', () => {
      render(<DropdownInput {...defaultProps} />);

      const call = vi.mocked(useClickOutside).mock.calls[0];
      expect(typeof call[1]).toBe('function');
    });
  });
});
