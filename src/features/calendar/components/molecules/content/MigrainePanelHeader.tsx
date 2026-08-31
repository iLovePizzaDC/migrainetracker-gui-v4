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

			<h2 className='text-sm font-medium tracking-wide text-white/85'>
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
						onClick={() => setAreInputsDisabled(true)}
						className='rounded-lg px-2 py-1 text-xs font-medium text-white/55 transition-colors duration-200 ease-soft hover:bg-white/[0.06] hover:text-white/85 disabled:opacity-40'
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
