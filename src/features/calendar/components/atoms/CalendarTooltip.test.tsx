import CalendarTooltip from '@/features/calendar/components/atoms/CalendarTooltip';
import { render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { describe, expect, it } from 'vitest';

describe('<CalendarTooltip />', () => {
	it('renders children', () => {
		render(<CalendarTooltip ref={undefined}>Tooltip content</CalendarTooltip>);

		expect(screen.getByText('Tooltip content')).toBeInTheDocument();
	});

	it('renders complex children', () => {
		render(
			<CalendarTooltip ref={undefined}>
				<span>Child one</span>
				<span>Child two</span>
			</CalendarTooltip>,
		);

		expect(screen.getByText('Child one')).toBeInTheDocument();
		expect(screen.getByText('Child two')).toBeInTheDocument();
	});

	it('forwards ref to the div element', () => {
		const ref = createRef<HTMLDivElement>();

		render(<CalendarTooltip ref={ref}>Content</CalendarTooltip>);

		expect(ref.current).toBeInstanceOf(HTMLDivElement);
		expect(ref.current).toContainElement(screen.getByText('Content'));
	});

	it('renders without ref', () => {
		render(<CalendarTooltip ref={undefined}>Content</CalendarTooltip>);

		expect(screen.getByText('Content')).toBeInTheDocument();
	});
});
