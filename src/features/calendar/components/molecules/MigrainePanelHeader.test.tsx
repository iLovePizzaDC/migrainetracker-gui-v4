import MigrainePanelHeader from '@/features/calendar/components/molecules/MigrainePanelHeader';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const mockDate = new Date('01-01-2026');
const mockOnClose = vi.fn();
const mockSetAreInputsDisabled = vi.fn();

describe('<MigrainePanelHeader />', () => {
	const user = userEvent.setup();

	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('renders formatted date', () => {
		render(
			<MigrainePanelHeader
				date={mockDate}
				onClose={mockOnClose}
				areInputsDisabled={false}
				setAreInputsDisabled={mockSetAreInputsDisabled}
				isLoading={false}
			/>,
		);

		expect(screen.getByText('01.01.')).toBeInTheDocument();
	});

	it('calls onClose when Close is clicked', async () => {
		render(
			<MigrainePanelHeader
				date={mockDate}
				onClose={mockOnClose}
				areInputsDisabled={false}
				setAreInputsDisabled={mockSetAreInputsDisabled}
				isLoading={false}
			/>,
		);

		await user.click(screen.getByRole('button', { name: 'Close' }));

		expect(mockOnClose).toHaveBeenCalledOnce();
	});

	it('disables Close when isLoading', () => {
		render(
			<MigrainePanelHeader
				date={mockDate}
				onClose={mockOnClose}
				areInputsDisabled={false}
				setAreInputsDisabled={mockSetAreInputsDisabled}
				isLoading
			/>,
		);

		expect(screen.getByRole('button', { name: 'Close' })).toBeDisabled();
	});

	it('renders no edit button when prefilled is not set', () => {
		render(
			<MigrainePanelHeader
				date={mockDate}
				onClose={mockOnClose}
				prefilled={null}
				areInputsDisabled={false}
				setAreInputsDisabled={mockSetAreInputsDisabled}
				isLoading={false}
			/>,
		);

		expect(screen.queryByTestId('edit-button')).not.toBeInTheDocument();
	});

	it('renders edit button when prefilled is set', () => {
		render(
			<MigrainePanelHeader
				date={mockDate}
				onClose={mockOnClose}
				prefilled={{} as any}
				areInputsDisabled={false}
				setAreInputsDisabled={mockSetAreInputsDisabled}
				isLoading={false}
			/>,
		);

		expect(screen.getByTestId('edit-button')).toBeInTheDocument();
	});

	it('toggles areInputsDisabled on edit button click', async () => {
		render(
			<MigrainePanelHeader
				date={mockDate}
				onClose={mockOnClose}
				prefilled={{} as any}
				areInputsDisabled={false}
				setAreInputsDisabled={mockSetAreInputsDisabled}
				isLoading={false}
			/>,
		);

		await user.click(screen.getByTestId('edit-button'));

		expect(mockSetAreInputsDisabled).toHaveBeenCalledWith(true);
	});

	it('disables edit button when isLoading', () => {
		render(
			<MigrainePanelHeader
				date={mockDate}
				onClose={mockOnClose}
				prefilled={{} as any}
				areInputsDisabled={false}
				setAreInputsDisabled={mockSetAreInputsDisabled}
				isLoading
			/>,
		);

		expect(screen.getByTestId('edit-button')).toBeDisabled();
	});
});
