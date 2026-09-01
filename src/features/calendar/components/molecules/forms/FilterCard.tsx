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
		<div className='fab-anchor'>
			<div className='relative'>
				<button
					data-testid='toggle-button'
					type='button'
					onClick={() => setFilterOpen((prev) => !prev)}
					className='fab-btn'
					aria-label={filterOpen ? 'Close filter' : 'Open filter'}
					aria-expanded={filterOpen}
				>
					{filterOpen ? <XMarkIcon className='h-5 w-5' /> : <FunnelIcon className='h-5 w-5' />}
				</button>

				<div
					data-testid='filter-card'
					ref={cardRef}
					className={`popover-panel ${filterOpen ? 'popover-panel--open' : 'popover-panel--closed'}`}
				>
					<div className='section-header mb-3'>
						<h3 className='card-title'>Filter</h3>
						<button
							data-testid='close-button'
							type='button'
							onClick={() => setFilterOpen(false)}
							className='section-header-action icon-btn !h-8 !w-8'
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
