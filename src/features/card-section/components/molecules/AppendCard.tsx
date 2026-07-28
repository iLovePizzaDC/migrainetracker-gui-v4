import CardShell from '@/features/card-section/components/atoms/card/CardShell';
import CardForm from '@/features/card-section/components/molecules/CardForm';
import { useCardSetups } from '@/features/card-section/hooks/use-card-setups';
import { PlusIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';

function AppendCard() {
	const { appendSetup } = useCardSetups();

	const [expanded, setExpanded] = useState(false);

	return (
		<CardShell padded={false} tabIndex={-1}>
			<div
				className='p-4 sm:p-6 flex items-center justify-between cursor-pointer'
				onClick={() => setExpanded(!expanded)}
			>
				<h2 className='text-lg font-semibold'>Add more</h2>
				<PlusIcon
					className={`w-6 h-6 transition-transform duration-300 ${expanded ? 'rotate-45' : ''}`}
				/>
			</div>
			<div
				data-testid='card-form-wrapper'
				className={`
	        grid overflow-hidden
	        transition-[grid-template-rows,opacity] duration-300 ease-out
	        ${expanded ? 'grid-rows-[1fr] opacity-100 px-6 pb-6' : 'grid-rows-[0fr] opacity-0'}
        `}
			>
				<div className='overflow-hidden'>
					<CardForm onButtonClick={appendSetup} />
				</div>
			</div>
		</CardShell>
	);
}
export default AppendCard;
