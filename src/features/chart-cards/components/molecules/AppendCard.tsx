import CardShell from '@/features/chart-cards/components/atoms/card/CardShell';
import CardForm from '@/features/chart-cards/components/molecules/CardForm';
import { useCardSetups } from '@/features/chart-cards/hooks/use-card-setups';
import { PlusIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';

function AppendCard() {
	const { appendSetup } = useCardSetups();

	const [expanded, setExpanded] = useState(false);

	return (
		<CardShell padded={false} tabIndex={-1}>
			<button
				type='button'
				className='flex h-14 w-full items-center justify-between px-4 sm:px-5'
				onClick={() => setExpanded(!expanded)}
				aria-expanded={expanded}
			>
				<span className='inline-flex items-center text-sm font-medium tracking-wide text-white/80'>
					Add more
				</span>
				<PlusIcon
					className={`h-5 w-5 shrink-0 text-white/50 icon-spin ${expanded ? 'icon-spin-open' : ''}`}
				/>
			</button>
			<div
				data-testid='card-form-wrapper'
				className={`grid motion-reveal ${expanded ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}
			>
				<div className='min-h-0 overflow-hidden'>
					<div className='border-t border-white/[0.06] px-5 pb-5 pt-4 sm:px-6 sm:pb-6'>
						<CardForm onButtonClick={appendSetup} />
					</div>
				</div>
			</div>
		</CardShell>
	);
}
export default AppendCard;
