import CardShell from '@/features/chart-cards/components/atoms/card/CardShell';
import CardForm from '@/features/chart-cards/components/molecules/CardForm';
import { useCardSetups } from '@/features/chart-cards/hooks/use-card-setups';
import Reveal from '@/shared/components/atoms/Reveal';
import { PlusIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';

function AppendCard() {
	const { appendSetup } = useCardSetups();

	const [expanded, setExpanded] = useState(false);

	return (
		<CardShell padded={false} tabIndex={-1}>
			<button
				type='button'
				className='flex h-12 w-full items-center justify-between card-padding-x sm:h-14'
				onClick={() => setExpanded(!expanded)}
				aria-expanded={expanded}
			>
				<span className='card-title'>Add more</span>
				<PlusIcon
					className={`h-5 w-5 shrink-0 text-white/50 icon-spin ${expanded ? 'icon-spin-open' : ''}`}
				/>
			</button>
			<Reveal open={expanded} data-testid='card-form-wrapper'>
				<div className='border-t border-white/[0.06] card-padding-x pb-3 pt-3 sm:pb-4 sm:pt-4 md:pb-6 md:pt-4'>
					<CardForm onButtonClick={appendSetup} setIsEditing={setExpanded} />
				</div>
			</Reveal>
		</CardShell>
	);
}
export default AppendCard;
