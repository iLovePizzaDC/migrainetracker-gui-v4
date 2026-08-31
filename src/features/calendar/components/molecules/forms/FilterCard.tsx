import { useCalendar } from '@/features/calendar/hooks/use-calendar';
import FilterForm from '@/shared/components/molecules/FilterForm';
import { FILTER_FORM_VARIANTS } from '@/shared/constants/variants/filter-form';
import { useClickOutside } from '@/shared/hooks/use-click-outside';
import { FunnelIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { useRef, useState } from 'react';

function FilterCard() {
	const { filter, setFilter } = useCalendar();

	const [filterOpen, setFilterOpen] = useState(false);

	const cardRef = useRef<HTMLDivElement>(null);

	useClickOutside(cardRef, () => {
		setFilterOpen(false);
	});

	return (
		<div className='fixed bottom-5 right-5 z-50'>
			<div className='relative'>
				<button
					data-testid='toggle-button'
					onClick={() => setFilterOpen((prev) => !prev)}
					className='flex h-12 w-12 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white/80 shadow-sm shadow-black/20 backdrop-blur-md transition-colors duration-200 ease-soft hover:bg-white/15 hover:text-white'
					aria-label={filterOpen ? 'Close filter' : 'Open filter'}
					aria-expanded={filterOpen}
				>
					{filterOpen ? <XMarkIcon className='h-5 w-5' /> : <FunnelIcon className='h-5 w-5' />}
				</button>

				<div
					data-testid='filter-card'
					ref={cardRef}
					className={`
						glass-panel absolute bottom-full right-0 mb-3 w-64 p-4
						origin-bottom-right
						transition-[opacity,transform] duration-350 ease-smooth
						${filterOpen ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-1.5 opacity-0'}
					`}
				>
					<div className='mb-3 flex items-center justify-between'>
						<h3 className='text-sm font-medium text-white/80'>Filter</h3>
						<button
							data-testid='close-button'
							onClick={() => setFilterOpen(false)}
							className='icon-btn !h-8 !w-8'
							aria-label='Close filter'
						>
							<XMarkIcon className='!h-4 !w-4' />
						</button>
					</div>

					<FilterForm
						variant={FILTER_FORM_VARIANTS.COMPACT}
						filter={filter}
						setFilter={setFilter}
					/>
				</div>
			</div>
		</div>
	);
}

export default FilterCard;
