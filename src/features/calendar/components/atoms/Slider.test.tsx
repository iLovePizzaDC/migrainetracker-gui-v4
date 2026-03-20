import Slider from '@/features/calendar/components/atoms/Slider';
import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const mockOnChange = vi.fn();

describe('<Slider />', () => {
	beforeEach(() => {
		mockOnChange.mockClear();
	});

	it('renders label and slider', () => {
		render(
			<Slider id='slider' label='Slider' min={0} max={10} value={5} onChange={mockOnChange} />,
		);

		expect(screen.getByLabelText('Slider: 5')).toBeInTheDocument();
		expect(screen.getByRole('slider', { name: 'Slider: 5' })).toBeInTheDocument();
	});

	it('displays current value in label', () => {
		render(
			<Slider id='slider' label='test label' min={0} max={10} value={3} onChange={mockOnChange} />,
		);

		expect(screen.getByLabelText('test label: 3')).toBeInTheDocument();
	});

	it('has correct min and max attributes', () => {
		render(<Slider id='slider' label='Slider' min={3} max={7} value={5} onChange={mockOnChange} />);

		const slider = screen.getByRole('slider');
		expect(slider).toHaveAttribute('min', '3');
		expect(slider).toHaveAttribute('max', '7');
	});

	it('calls onChange when adjusting slider', () => {
		render(
			<Slider id='slider' label='Slider' min={0} max={10} value={5} onChange={mockOnChange} />,
		);

		fireEvent.change(screen.getByRole('slider'), { target: { value: 8 } });

		expect(mockOnChange).toHaveBeenCalledWith(8);
	});

	it('is disabled if prop is true', () => {
		render(
			<Slider
				id='slider'
				label='Slider'
				min={0}
				max={10}
				value={5}
				onChange={mockOnChange}
				disabled
			/>,
		);

		expect(screen.getByRole('slider')).toBeDisabled();
	});
});
