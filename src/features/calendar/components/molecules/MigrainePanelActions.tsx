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
				feedback={cacheFeedback}
			/>

			<SubmitButton
				type={BUTTON_TYPES.BUTTON}
				label='Submit'
				loadingLabel='Submitting...'
				loading={isLoading}
				onClick={submitNewEntry}
				variant='primary'
				feedback={saveFeedback}
			/>
		</div>
	);
}
