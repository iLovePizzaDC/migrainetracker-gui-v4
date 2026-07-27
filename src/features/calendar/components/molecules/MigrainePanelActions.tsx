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

export default function MigrainePanelActions({ cacheFeedback, saveFeedback, isLoading, saveNewEntry, submitNewEntry }: IMigrainePanelActions) {
  return (
    <div className='flex justify-between pt-2'>
      <SubmitButton
        type={BUTTON_TYPES.BUTTON}
        label='Save'
        onClick={saveNewEntry}
        className={`
                    ${cacheFeedback === 'success' ? 'border-green-500/50 text-green-800' : ''}
                    ${cacheFeedback === 'error' ? 'border-red-500/50 text-red-800' : ''}
                    ${!cacheFeedback ? 'bg-gray-600/50 border-gray-700/20 text-white' : ''}
                `}
      />

      <SubmitButton
        type={BUTTON_TYPES.BUTTON}
        label={isLoading ? 'Submitting...' : 'Submit'}
        onClick={submitNewEntry}
        disabled={isLoading}
        className={`
                    ${saveFeedback === 'success' ? 'border-green-500/50 text-green-800' : ''}
                    ${saveFeedback === 'error' ? 'border-red-500/50 text-red-800' : ''}
                    ${!saveFeedback ? 'bg-purple-600/50 border-purple-700/20 text-white' : ''}
                `}
      />
    </div>
  );
}
