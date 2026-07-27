import NavigationLink from '@/app/components/atoms/navigation/NavigationLink';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

vi.mock('react-router-dom', () => ({
	useLocation: () => ({ pathname: '/' }),
	Link: ({ children, to, className, onClick }: any) => (
		<a
			data-testid='navigation-link'
			href={to}
			className={className}
			onClick={(e) => {
				e.preventDefault();
				onClick?.(e);
			}}
		>
			{children}
		</a>
	),
}));

describe('<NavigationLink />', () => {
	const user = userEvent.setup();
	const defaultProps = {
		label: 'Test label',
		to: '/test',
	};

	it('renders label', () => {
		render(<NavigationLink {...defaultProps} />);

		expect(screen.getByText('Test label')).toBeInTheDocument();
	});

	it('sets correct to attribute', () => {
		render(<NavigationLink {...defaultProps} />);

		expect(screen.getByTestId('navigation-link')).toHaveAttribute('href', '/test');
	});

	it('applies active classes when pathname matches', () => {
		render(<NavigationLink {...defaultProps} to='/test' />);
		expect(screen.getByTestId('navigation-link')).toHaveClass('border-transparent');
	});

	it('calls onClick when clicked', async () => {
		const mockOnClick = vi.fn();
		render(<NavigationLink {...defaultProps} onClick={mockOnClick} />);

		await user.click(screen.getByTestId('navigation-link'));

		expect(mockOnClick).toHaveBeenCalled();
	});
});
