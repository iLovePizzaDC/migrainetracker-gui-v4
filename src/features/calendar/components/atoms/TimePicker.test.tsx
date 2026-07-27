import TimePicker from '@/features/calendar/components/atoms/TimePicker';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/features/calendar/hooks/use-scroll-snap-picker', () => ({
	useScrollSnapPicker: () => ({
		inputRef: { current: null },
		pickerRef: { current: null },
		hourRef: { current: null },
		minuteRef: { current: null },
		scrollToIndex: vi.fn(),
		handleScroll: vi.fn(),
	}),
}));
vi.mock('@/shared/hooks/use-click-outside', () => ({
	useClickOutside: vi.fn(),
}));
vi.mock('@/features/calendar/utils/scroll-snap-helper', () => ({
	normalizeTime: (value: string) => value,
}));

const mockOnChange = vi.fn();

describe('<TimePicker />', () => {
	const user = userEvent.setup();

	beforeEach(() => {
		mockOnChange.mockClear();
	});

	describe('input field', () => {
		it('renders label and input field', () => {
			render(<TimePicker id='time' label='Time' value='10:00' onChange={mockOnChange} />);

			expect(screen.getByLabelText('Time')).toBeInTheDocument();
			expect(screen.getByPlaceholderText('HH:mm')).toBeInTheDocument();
		});

		it('renders default value', () => {
			render(<TimePicker id='time' label='Time' value='10:00' onChange={mockOnChange} />);
			expect(screen.getByLabelText('Time')).toHaveValue('10:00');
		});

		it('calls onChange when value changes', async () => {
			render(<TimePicker id='time' label='Time' value='10:00' onChange={mockOnChange} />);

			await user.type(screen.getByLabelText('Time'), '2');

			expect(mockOnChange).toHaveBeenCalled();
		});

		it('is disabled if prop is true', () => {
			render(<TimePicker id='time' label='Time' value='10:00' onChange={mockOnChange} disabled />);

			expect(screen.getByLabelText('Time')).toBeDisabled();
		});

		it('is required if prop is true', () => {
			render(<TimePicker id='time' label='Time' value='10:00' onChange={mockOnChange} required />);

			expect(screen.getByLabelText('Time')).toBeRequired();
		});
	});

	describe('picker popup', () => {
		it('opens popup on click', async () => {
			render(<TimePicker id='time' label='Time' value='10:00' onChange={mockOnChange} />);

			expect(screen.queryByTestId('picker-popup')).not.toBeInTheDocument();

			await user.click(screen.getByLabelText('Time'));

			expect(screen.getByTestId('picker-popup')).toBeInTheDocument();
		});

		it('does not open popup when disabled', async () => {
			render(<TimePicker id='time' label='Time' value='10:00' onChange={mockOnChange} disabled />);

			await user.click(screen.getByLabelText('Time'));

			expect(screen.queryByTestId('picker-popup')).not.toBeInTheDocument();
		});

		it('calls onChange with correct value when clicking an hour', async () => {
			render(<TimePicker id='time' label='Time' value='10:00' onChange={mockOnChange} />);

			await user.click(screen.getByLabelText('Time'));
			await user.click(screen.getByText('11'));

			expect(mockOnChange).toHaveBeenCalledWith('11:00');
		});

		it('calls onChange with correct value when clicking an minute', async () => {
			render(<TimePicker id='time' label='Time' value='10:00' onChange={mockOnChange} />);

			await user.click(screen.getByLabelText('Time'));
			await user.click(screen.getByText('30'));

			expect(mockOnChange).toHaveBeenCalledWith('10:30');
		});
	});
});
