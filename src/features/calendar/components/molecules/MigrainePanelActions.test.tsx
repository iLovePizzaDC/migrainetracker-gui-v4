import MigrainePanelActions from '@/features/calendar/components/molecules/MigrainePanelActions';
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

	it('keeps Save button styling on cacheFeedback success', () => {
		render(
			<MigrainePanelActions
				cacheFeedback='success'
				saveFeedback={null}
				isLoading={false}
				saveNewEntry={mockSaveNewEntry}
				submitNewEntry={mockSubmitNewEntry}
			/>,
		);

		const saveButton = screen.getByRole('button', { name: 'Save' });
		expect(saveButton).toHaveClass('btn-secondary', 'btn-feedback-success');
		expect(saveButton).toHaveTextContent('Save');
	});

	it('keeps Save button styling on cacheFeedback error', () => {
		render(
			<MigrainePanelActions
				cacheFeedback='error'
				saveFeedback={null}
				isLoading={false}
				saveNewEntry={mockSaveNewEntry}
				submitNewEntry={mockSubmitNewEntry}
			/>,
		);

		const saveButton = screen.getByRole('button', { name: 'Save' });
		expect(saveButton).toHaveClass('btn-secondary', 'btn-feedback-error');
		expect(saveButton).toHaveTextContent('Save');
	});

	it('keeps Submit button styling on saveFeedback success', () => {
		render(
			<MigrainePanelActions
				cacheFeedback={null}
				saveFeedback='success'
				isLoading={false}
				saveNewEntry={mockSaveNewEntry}
				submitNewEntry={mockSubmitNewEntry}
			/>,
		);

		const submitButton = screen.getByRole('button', { name: 'Submit' });
		expect(submitButton).toHaveClass('btn-primary', 'btn-feedback-success');
		expect(submitButton).toHaveTextContent('Submit');
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

		expect(screen.getByRole('button', { name: 'Save' })).toHaveClass('btn-secondary');
		expect(screen.getByRole('button', { name: 'Submit' })).toHaveClass('btn-primary');
	});
});
