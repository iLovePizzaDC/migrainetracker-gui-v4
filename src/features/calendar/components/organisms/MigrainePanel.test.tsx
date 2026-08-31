import MigrainePanel from '@/features/calendar/components/organisms/MigrainePanel';
import { useMigrainePanel } from '@/features/calendar/hooks/use-migraine-panel';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/features/calendar/hooks/use-migraine-panel', () => ({
	useMigrainePanel: vi.fn(),
}));

vi.mock('@/features/calendar/components/molecules/forms/Durations', () => ({
	default: ({ disabled }: any) => <div data-testid='durations' data-disabled={String(disabled)} />,
}));
vi.mock('@/features/calendar/components/molecules/forms/Intensity', () => ({
	default: ({ disabled }: any) => <div data-testid='intensity' data-disabled={String(disabled)} />,
}));
vi.mock('@/features/calendar/components/molecules/forms/Symptoms', () => ({
	default: ({ disabled }: any) => <div data-testid='symptoms' data-disabled={String(disabled)} />,
}));
vi.mock('@/features/calendar/components/molecules/forms/Medicine', () => ({
	default: ({ disabled }: any) => <div data-testid='medicine' data-disabled={String(disabled)} />,
}));
vi.mock('@/features/calendar/components/molecules/forms/Midas', () => ({
	default: ({ disabled }: any) => <div data-testid='midas' data-disabled={String(disabled)} />,
}));
vi.mock('@/features/calendar/components/molecules/content/MigrainePanelHeader', () => ({
	default: ({ date, prefilled, onClose, areInputsDisabled, setAreInputsDisabled }: any) => (
		<div data-testid='header' data-date={date?.toISOString()} data-prefilled={String(!!prefilled)}>
			<button data-testid='header-close-trigger' onClick={onClose} />
			<button
				data-testid='header-toggle-trigger'
				onClick={() => setAreInputsDisabled(!areInputsDisabled)}
			/>
		</div>
	),
}));
vi.mock('@/features/calendar/components/molecules/MigrainePanelActions', () => ({
	default: ({ cacheFeedback, saveFeedback, isLoading, saveNewEntry, submitNewEntry }: any) => (
		<div
			data-testid='actions'
			data-cache-feedback={String(cacheFeedback)}
			data-save-feedback={String(saveFeedback)}
			data-loading={String(isLoading)}
		>
			<button data-testid='actions-save-trigger' onClick={saveNewEntry} />
			<button data-testid='actions-submit-trigger' onClick={submitNewEntry} />
		</div>
	),
}));

const mockDate = new Date('01-01-2026');
const mockOnClose = vi.fn();

const baseHookReturn = {
	areInputsDisabled: false,
	setAreInputsDisabled: vi.fn(),
	cacheFeedback: null,
	saveFeedback: null,
	isLoading: false,
	form: {
		durations: [],
		intensity: null,
		symptoms: [],
		medicines: [],
		midas: {},
	},
	updateForm: vi.fn(),
	showMedicine: true,
	submitNewEntry: vi.fn(),
	saveNewEntry: vi.fn(),
};

describe('<MigrainePanel />', () => {
	const user = userEvent.setup();

	beforeEach(() => {
		vi.clearAllMocks();
		vi.mocked(useMigrainePanel).mockReturnValue(baseHookReturn as any);
	});

	it('calls useMigrainePanel with date, onClose, disabled and prefilled', () => {
		const prefilled = { intensity: 'HIGH' } as any;
		render(
			<MigrainePanel date={mockDate} onClose={mockOnClose} prefilled={prefilled} disabled isOpen />,
		);

		expect(useMigrainePanel).toHaveBeenCalledWith(mockDate, mockOnClose, true, prefilled);
	});

	it('renders header, molecules and actions', () => {
		render(<MigrainePanel date={mockDate} onClose={mockOnClose} isOpen />);

		expect(screen.getByTestId('header')).toBeInTheDocument();
		expect(screen.getByTestId('durations')).toBeInTheDocument();
		expect(screen.getByTestId('intensity')).toBeInTheDocument();
		expect(screen.getByTestId('symptoms')).toBeInTheDocument();
		expect(screen.getByTestId('medicine')).toBeInTheDocument();
		expect(screen.getByTestId('midas')).toBeInTheDocument();
		expect(screen.getByTestId('actions')).toBeInTheDocument();
	});

	it('hides Medicine when showMedicine is false', () => {
		vi.mocked(useMigrainePanel).mockReturnValue({ ...baseHookReturn, showMedicine: false } as any);

		render(<MigrainePanel date={mockDate} onClose={mockOnClose} isOpen />);

		expect(screen.queryByTestId('medicine')).not.toBeInTheDocument();
	});

	it('hides actions when areInputsDisabled is true', () => {
		vi.mocked(useMigrainePanel).mockReturnValue({
			...baseHookReturn,
			areInputsDisabled: true,
		} as any);

		render(<MigrainePanel date={mockDate} onClose={mockOnClose} isOpen />);

		expect(screen.getByTestId('actions').parentElement).toHaveClass('invisible');
	});

	it('passes disabled=true to molecules when areInputsDisabled is true', () => {
		vi.mocked(useMigrainePanel).mockReturnValue({
			...baseHookReturn,
			areInputsDisabled: true,
		} as any);

		render(<MigrainePanel date={mockDate} onClose={mockOnClose} isOpen />);

		expect(screen.getByTestId('durations')).toHaveAttribute('data-disabled', 'true');
		expect(screen.getByTestId('intensity')).toHaveAttribute('data-disabled', 'true');
		expect(screen.getByTestId('symptoms')).toHaveAttribute('data-disabled', 'true');
		expect(screen.getByTestId('midas')).toHaveAttribute('data-disabled', 'true');
	});

	it('passes disabled=true to molecules when isLoading is true', () => {
		vi.mocked(useMigrainePanel).mockReturnValue({ ...baseHookReturn, isLoading: true } as any);

		render(<MigrainePanel date={mockDate} onClose={mockOnClose} isOpen />);

		expect(screen.getByTestId('durations')).toHaveAttribute('data-disabled', 'true');
	});

	it('passes disabled=false when neither areInputsDisabled nor isLoading is set', () => {
		render(<MigrainePanel date={mockDate} onClose={mockOnClose} isOpen />);

		expect(screen.getByTestId('durations')).toHaveAttribute('data-disabled', 'false');
	});

	it('forwards onClose to the header', async () => {
		render(<MigrainePanel date={mockDate} onClose={mockOnClose} isOpen />);

		await user.click(screen.getByTestId('header-close-trigger'));

		expect(mockOnClose).toHaveBeenCalledOnce();
	});

	it('forwards setAreInputsDisabled to the header', async () => {
		render(<MigrainePanel date={mockDate} onClose={mockOnClose} isOpen />);

		await user.click(screen.getByTestId('header-toggle-trigger'));

		expect(baseHookReturn.setAreInputsDisabled).toHaveBeenCalledWith(true);
	});

	it('forwards feedback state and callbacks to actions', async () => {
		vi.mocked(useMigrainePanel).mockReturnValue({
			...baseHookReturn,
			cacheFeedback: 'success',
			saveFeedback: 'error',
		} as any);

		render(<MigrainePanel date={mockDate} onClose={mockOnClose} isOpen />);

		expect(screen.getByTestId('actions')).toHaveAttribute('data-cache-feedback', 'success');
		expect(screen.getByTestId('actions')).toHaveAttribute('data-save-feedback', 'error');

		await user.click(screen.getByTestId('actions-save-trigger'));
		expect(baseHookReturn.saveNewEntry).toHaveBeenCalledOnce();

		await user.click(screen.getByTestId('actions-submit-trigger'));
		expect(baseHookReturn.submitNewEntry).toHaveBeenCalledOnce();
	});

	it('collapses when isOpen is false', () => {
		render(<MigrainePanel date={mockDate} onClose={mockOnClose} isOpen={false} />);

		expect(screen.getByTestId('migraine-panel-reveal')).toHaveClass('grid-rows-[0fr]');
		expect(screen.getByTestId('migraine-panel')).toBeInTheDocument();
	});
});
