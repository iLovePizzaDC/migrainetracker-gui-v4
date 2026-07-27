import { PencilIcon, XMarkIcon } from '@heroicons/react/24/outline';
import type { FeedbackType } from '@/shared/constants/button/feedback';
import type { Entry } from '@/features/calendar/types/calendar';

interface Props {
  date: Date;
  onClose: () => void;
  prefilled?: Entry | null;
  areInputsDisabled: boolean;
  setAreInputsDisabled: (v: boolean) => void;
  isLoading: boolean;
}

export default function MigrainePanelHeader({ date, onClose, prefilled, areInputsDisabled, setAreInputsDisabled, isLoading }: Props) {
  return (
    <div className='flex justify-between items-center'>
      <button
        onClick={onClose}
        className='text-sm text-gray-400 hover:opacity-80 disabled:opacity-80 transition-opacity'
        disabled={isLoading}
      >
        Close
      </button>

      <h2 className='text-lg font-semibold'>
        {date.toLocaleDateString('de-DE', {
          day: '2-digit',
          month: '2-digit',
        })}
      </h2>

      {prefilled ? (
        <button
          data-testid='edit-button'
          onClick={() => setAreInputsDisabled(!areInputsDisabled)}
          className='text-sm text-gray-400 hover:opacity-80 disabled:opacity-80 transition-opacity'
          disabled={isLoading}
        >
          {areInputsDisabled ? <PencilIcon className='h-5 w-5' /> : <XMarkIcon className='h-5 w-5' />}
        </button>
      ) : (
        <div className='h-5 w-5' />
      )}
    </div>
  );
}
