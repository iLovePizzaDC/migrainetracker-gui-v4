import MigrainePanelActions from '@/features/calendar/components/molecules/inputs/MigrainePanelActions';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const mockSaveNewEntry = vi.fn();
const mockSubmitNewEntry = vi.fn();

describe('<MigrainePanelActions />', () => {
	const user = userEvent.setup();

	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('calls saveNewEntry when Save is clicked', async () => {
		render(
			<MigrainePanelActions
				cacheFeedback={null}
				saveFeedback={null}
				isLoading={false}
				saveNewEntry={mockSaveNewEntry}
				submitNewEntry={mockSubmitNewEntry}
			/>,
		);

		await user.click(screen.getByRole('button', { name: 'Save' }));

		expect(mockSaveNewEntry).toHaveBeenCalledOnce();
	});

	it('calls submitNewEntry when Submit is clicked', async () => {
		render(
			<MigrainePanelActions
				cacheFeedback={null}
				saveFeedback={null}
				isLoading={false}
				saveNewEntry={mockSaveNewEntry}
				submitNewEntry={mockSubmitNewEntry}
			/>,
		);

		await user.click(screen.getByRole('button', { name: 'Submit' }));

		expect(mockSubmitNewEntry).toHaveBeenCalledOnce();
	});

	it('shows "Submitting..." and disables Submit when isLoading', () => {
		render(
			<MigrainePanelActions
				cacheFeedback={null}
				saveFeedback={null}
				isLoading
				saveNewEntry={mockSaveNewEntry}
				submitNewEntry={mockSubmitNewEntry}
			/>,
		);

		expect(screen.getByRole('button', { name: 'Submitting...' })).toBeDisabled();
	});

	it('applies success styling to Save on cacheFeedback success', () => {
		render(
			<MigrainePanelActions
				cacheFeedback='success'
				saveFeedback={null}
				isLoading={false}
				saveNewEntry={mockSaveNewEntry}
				submitNewEntry={mockSubmitNewEntry}
			/>,
		);

		expect(screen.getByRole('button', { name: 'Save' })).toHaveClass(
			'border-green-500/50',
			'text-green-800',
		);
	});

	it('applies error styling to Save on cacheFeedback error', () => {
		render(
			<MigrainePanelActions
				cacheFeedback='error'
				saveFeedback={null}
				isLoading={false}
				saveNewEntry={mockSaveNewEntry}
				submitNewEntry={mockSubmitNewEntry}
			/>,
		);

		expect(screen.getByRole('button', { name: 'Save' })).toHaveClass(
			'border-red-500/50',
			'text-red-800',
		);
	});

	it('applies success styling to Submit on saveFeedback success', () => {
		render(
			<MigrainePanelActions
				cacheFeedback={null}
				saveFeedback='success'
				isLoading={false}
				saveNewEntry={mockSaveNewEntry}
				submitNewEntry={mockSubmitNewEntry}
			/>,
		);

		expect(screen.getByRole('button', { name: 'Submit' })).toHaveClass(
			'border-green-500/50',
			'text-green-800',
		);
	});

	it('applies default styling when no feedback is set', () => {
		render(
			<MigrainePanelActions
				cacheFeedback={null}
				saveFeedback={null}
				isLoading={false}
				saveNewEntry={mockSaveNewEntry}
				submitNewEntry={mockSubmitNewEntry}
			/>,
		);

		expect(screen.getByRole('button', { name: 'Save' })).toHaveClass('bg-gray-600/50');
		expect(screen.getByRole('button', { name: 'Submit' })).toHaveClass('bg-purple-600/50');
	});
});
