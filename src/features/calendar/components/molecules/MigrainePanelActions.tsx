import SubmitButton from '@/shared/components/atoms/SubmitButton';
import { BUTTON_TYPES } from '@/shared/constants/input/button';
import type { FeedbackType } from '@/shared/constants/button/feedback';

interface IMigrainePanelActions {
	cacheFeedback: FeedbackType;
	saveFeedback: FeedbackType;
	isLoading: boolean;
	saveNewEntry: () => void;
	submitNewEntry: () => void;
}

const feedbackClass = (feedback: FeedbackType) => {
	if (feedback === 'success') return 'border-emerald-400/45';
	if (feedback === 'error') return 'border-red-400/45';
	return '';
};

export default function MigrainePanelActions({
	cacheFeedback,
	saveFeedback,
	isLoading,
	saveNewEntry,
	submitNewEntry,
}: IMigrainePanelActions) {
	return (
		<div className='flex justify-end gap-3 border-t border-white/[0.06] pt-5'>
			<SubmitButton
				type={BUTTON_TYPES.BUTTON}
				label='Save'
				onClick={saveNewEntry}
				variant='secondary'
				className={feedbackClass(cacheFeedback)}
			/>

			<SubmitButton
				type={BUTTON_TYPES.BUTTON}
				label={isLoading ? 'Submitting...' : 'Submit'}
				onClick={submitNewEntry}
				disabled={isLoading}
				variant='primary'
				className={feedbackClass(saveFeedback)}
			/>
		</div>
	);
}
