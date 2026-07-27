import Weekdays from '@/features/calendar/components/atoms/Weekdays';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

describe('<Weekdays />', () => {
	it('renders all 7 weekdays', () => {
		render(<Weekdays />);

		expect(screen.getByText('Mon.')).toBeInTheDocument();
		expect(screen.getByText('Tue.')).toBeInTheDocument();
		expect(screen.getByText('Wed.')).toBeInTheDocument();
		expect(screen.getByText('Thu.')).toBeInTheDocument();
		expect(screen.getByText('Fri.')).toBeInTheDocument();
		expect(screen.getByText('Sat.')).toBeInTheDocument();
		expect(screen.getByText('Sun.')).toBeInTheDocument();
	});
});
