import MigrainePanel from '@/features/calendar/components/organisms/MigrainePanel';
import { fetchNewEntry } from '@/shared/api/migraine.api';
import {
	INTENSITY_TYPES,
	MIDAS_TYPES,
	SYMPTOM_TYPES,
} from '@/shared/constants/event/event-details';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/features/calendar/hooks/use-calendar', () => ({
	useCalendar: () => ({
		refetchEvents: vi.fn(),
	}),
}));
vi.mock('@/features/calendar/components/molecules/Medicine', () => ({
	default: ({ disabled, medicines }: any) => (
		<div data-testid='medicine' data-disabled={disabled} data-count={medicines?.length ?? 0}>
			{medicines?.map((m: any, i: number) => (
				<div key={i} data-testid={`medicine-item-${i}`}>
					<span data-testid={`medicine-label-${i}`}>{m.medicine.label}</span>
					<span data-testid={`medicine-taken-${i}`}>{m.taken}</span>
					<span data-testid={`medicine-effectiveness-${i}`}>{m.effectiveness}</span>
				</div>
			))}
		</div>
	),
}));
vi.mock('@/shared/api/migraine.api', () => ({
	fetchNewEntry: vi.fn().mockResolvedValue(undefined),
}));

const mockDate = new Date('01-01-2026');
const mockOnClose = vi.fn();
const mockPrefilled = {
	durations: [
		{
			id: 0,
			startTime: '10:00',
			endTime: '15:00',
		},
	],
	intensity: INTENSITY_TYPES.HIGH,
	symptoms: [SYMPTOM_TYPES.NOISE, SYMPTOM_TYPES.LIGHT, SYMPTOM_TYPES.SMELL],
	medicines: [
		{
			medicine: {
				abbreviation: 'tst_med_0',
				label: 'Test medicine 0',
			},
			taken: 3,
			effectiveness: 2,
		},
	],
	midas: {
		[MIDAS_TYPES.WORK_MISSED]: true,
		[MIDAS_TYPES.WORK_IMPAIRED]: false,
		[MIDAS_TYPES.CHORES_MISSED]: true,
		[MIDAS_TYPES.CHORES_IMPAIRED]: false,
		[MIDAS_TYPES.SOCIAL_MISSED]: false,
	},
};

describe('<MigrainePanel />', () => {
	const user = userEvent.setup();

	beforeEach(() => {
		mockOnClose.mockClear();
		vi.mocked(fetchNewEntry).mockClear();
	});

	describe('rendering', () => {
		it('renders header, buttons and input fields when isOpen', () => {
			render(<MigrainePanel date={mockDate} onClose={mockOnClose} isOpen />);

			expect(screen.getByRole('button', { name: 'Close' })).toBeInTheDocument();
			expect(screen.getByText('01.01.')).toBeInTheDocument();
			expect(screen.queryByTestId('edit-button')).not.toBeInTheDocument();
			expect(screen.getByTestId('durations')).toBeInTheDocument();
			expect(screen.getByTestId('intensity')).toBeInTheDocument();
			expect(screen.getByTestId('symptoms')).toBeInTheDocument();
			expect(screen.getByTestId('medicine')).toBeInTheDocument();
			expect(screen.getByTestId('midas')).toBeInTheDocument();
			expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument();
			expect(screen.getByRole('button', { name: 'Submit' })).toBeInTheDocument();
		});

		it('renders edit button when prefilled is set', () => {
			render(
				<MigrainePanel date={mockDate} onClose={mockOnClose} prefilled={mockPrefilled} isOpen />,
			);

			expect(screen.queryByTestId('edit-button')).toBeInTheDocument();
		});

		it('hides when isOpen is false', () => {
			render(<MigrainePanel date={mockDate} onClose={mockOnClose} isOpen={false} />);

			expect(screen.getByTestId('migraine-panel')).toHaveClass(
				'opacity-0',
				'max-h-0',
				'pointer-events-none',
			);
		});

		it('passes prefilled values to child components', () => {
			render(
				<MigrainePanel date={mockDate} onClose={mockOnClose} prefilled={mockPrefilled} isOpen />,
			);

			expect(screen.getByLabelText('Start')).toHaveAttribute('value', '10:00');
			expect(screen.getByLabelText('End')).toHaveAttribute('value', '15:00');
			expect(screen.getByLabelText('High')).toBeChecked();
			expect(screen.getByLabelText('Noise Sensitive')).toBeChecked();
			expect(screen.getByLabelText('Light Sensitive')).toBeChecked();
			expect(screen.getByLabelText('Smell Sensitive')).toBeChecked();
			expect(screen.getByTestId('medicine')).toHaveAttribute('data-count', '1');
			expect(screen.getByTestId('medicine-label-0')).toHaveTextContent('Test medicine 0');
			expect(screen.getByTestId('medicine-taken-0')).toHaveTextContent('3');
			expect(screen.getByTestId('medicine-effectiveness-0')).toHaveTextContent('2');
			expect(screen.getByLabelText('I missed work')).toBeChecked();
			expect(screen.getByLabelText('I missed household chores')).toBeChecked();
		});
	});

	describe('disabled state', () => {
		it('hides submit buttons when disabled', () => {
			render(<MigrainePanel date={mockDate} onClose={mockOnClose} isOpen disabled />);

			expect(screen.getByTestId('medicine')).toHaveAttribute('data-disabled', 'true');
			expect(screen.queryByRole('button', { name: 'Save' })).not.toBeInTheDocument();
			expect(screen.queryByRole('button', { name: 'Submit' })).not.toBeInTheDocument();
		});

		it('hides medicine when prefilled with no medicines and disabled', () => {
			const prefilledNoMeds = { ...mockPrefilled, medicines: [] };
			render(
				<MigrainePanel
					date={mockDate}
					onClose={mockOnClose}
					prefilled={prefilledNoMeds}
					isOpen
					disabled
				/>,
			);

			expect(screen.queryByTestId('medicine')).not.toBeInTheDocument();
		});

		it('toggles edit mode on edit button click', async () => {
			render(
				<MigrainePanel
					date={mockDate}
					onClose={mockOnClose}
					prefilled={mockPrefilled}
					isOpen
					disabled
				/>,
			);

			expect(screen.queryByRole('button', { name: 'Submit' })).not.toBeInTheDocument();

			await user.click(screen.getByTestId('edit-button'));

			expect(screen.getByRole('button', { name: 'Submit' })).toBeInTheDocument();
		});
	});

	describe('interactions', () => {
		it('calls onClose when Close button is clicked', async () => {
			render(<MigrainePanel date={mockDate} onClose={mockOnClose} isOpen />);

			await user.click(screen.getByRole('button', { name: 'Close' }));

			expect(mockOnClose).toHaveBeenCalledOnce();
		});
	});

	describe('submit', () => {
		it('calls fetchNewEntry and closes on submit', async () => {
			render(<MigrainePanel date={mockDate} onClose={mockOnClose} isOpen />);

			await user.click(screen.getByRole('button', { name: 'Submit' }));

			expect(fetchNewEntry).toHaveBeenCalled();
			expect(mockOnClose).toHaveBeenCalled();
		});

		it('shows error feedback when submit fails', async () => {
			vi.mocked(fetchNewEntry).mockRejectedValueOnce(new Error('fail'));

			render(<MigrainePanel date={mockDate} onClose={mockOnClose} isOpen />);

			await user.click(screen.getByRole('button', { name: 'Submit' }));

			expect(screen.getByRole('button', { name: 'Submit' })).toBeInTheDocument();
			expect(mockOnClose).not.toHaveBeenCalled();
		});

		it('shows "Submitting..." and disables buttons while loading', async () => {
			vi.mocked(fetchNewEntry).mockImplementationOnce(() => new Promise(() => {}));

			render(<MigrainePanel date={mockDate} onClose={mockOnClose} isOpen />);

			await user.click(screen.getByRole('button', { name: 'Submit' }));

			expect(screen.getByRole('button', { name: 'Submitting...' })).toBeDisabled();
			expect(screen.getByRole('button', { name: 'Close' })).toBeDisabled();
		});
	});

	describe('save', () => {
		it('saves to localStorage and closes on save', async () => {
			const setItemSpy = vi.spyOn(Storage.prototype, 'setItem');
			const setTimeoutSpy = vi.spyOn(global, 'setTimeout');

			render(<MigrainePanel date={mockDate} onClose={mockOnClose} isOpen />);

			await user.click(screen.getByRole('button', { name: 'Save' }));

			expect(setItemSpy).toHaveBeenCalledWith('MT_NE', expect.any(String));

			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			const saveCall = setTimeoutSpy.mock.calls.find(([_, delay]) => delay === 500);
			expect(saveCall).toBeDefined();

			const callback = saveCall![0] as () => void;
			callback();

			expect(mockOnClose).toHaveBeenCalled();
		});
	});
});
