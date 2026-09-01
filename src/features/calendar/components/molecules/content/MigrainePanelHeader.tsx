import { PencilIcon, XMarkIcon } from '@heroicons/react/24/outline';
import type { Entry } from '@/features/calendar/types/calendar';

interface IMigrainePanelHeader {
	date: Date;
	onClose: () => void;
	prefilled?: Entry | null;
	areInputsDisabled: boolean;
	setAreInputsDisabled: (v: boolean) => void;
	isLoading: boolean;
}

export default function MigrainePanelHeader({
	date,
	onClose,
	prefilled,
	areInputsDisabled,
	setAreInputsDisabled,
	isLoading,
}: IMigrainePanelHeader) {
	return (
		<div className='flex items-center justify-between border-b border-white/[0.06] pb-4'>
			<button onClick={onClose} className='icon-btn' disabled={isLoading} aria-label='Close'>
				<XMarkIcon />
			</button>

			<h2 className='panel-header-title'>
				{date.toLocaleDateString('de-DE', {
					day: '2-digit',
					month: '2-digit',
				})}
			</h2>

			{prefilled ? (
				areInputsDisabled ? (
					<button
						data-testid='edit-button'
						onClick={() => setAreInputsDisabled(false)}
						className='icon-btn'
						disabled={isLoading}
						aria-label='Edit'
					>
						<PencilIcon />
					</button>
				) : (
					<button
						data-testid='cancel-edit-button'
						type='button'
						onClick={() => setAreInputsDisabled(true)}
						className='btn-ghost'
						disabled={isLoading}
					>
						Cancel
					</button>
				)
			) : (
				<div className='h-9 w-9' />
			)}
		</div>
	);
}
