import MedicineCombobox from '@/features/calendar/components/molecules/MedicineCombobox';
import { useCalendar } from '@/features/calendar/hooks/use-calendar';
import type { AppendMedicine } from '@/shared/types/calendar';
import { InformationCircleIcon, PlusIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';
import Slider from '@/features/calendar/components/atoms/inputs/Slider';
import AddMedicineForm from '@/features/calendar/components/molecules/forms/AddMedicineForm';
import Tooltip from '@/features/calendar/components/atoms/Tooltip';

interface IMedicine {
	medicines: AppendMedicine[];
	onChange: (medicines: AppendMedicine[]) => void;
	disabled?: boolean;
}

function Medicine({ medicines, onChange, disabled }: IMedicine) {
	const { medDaysCount, maxMedDaysCount } = useCalendar();

	const [showMedicineForm, setShowMedicineForm] = useState(false);

	return (
		<div className='form-section'>
			<div className='section-header'>
				<h3 className='section-title'>Medicines</h3>
				<button
					data-testid='add-medicine'
					onClick={() => setShowMedicineForm((prev) => !prev)}
					className={`section-header-action icon-btn !h-8 !w-8 ${disabled ? 'invisible' : ''}`}
					aria-label={showMedicineForm ? 'Close add medicine' : 'Add medicine'}
					aria-expanded={showMedicineForm}
					disabled={disabled}
					tabIndex={disabled ? -1 : undefined}
				>
					<PlusIcon className={`!h-4 !w-4 icon-spin ${showMedicineForm ? 'icon-spin-open' : ''}`} />
				</button>
			</div>

			<Tooltip
				content={
					<>
						<p>
							A “Med-Day” is any day on which you've taken acute medication (either medication of
							type "migraine-painkiller" or "painkiller"). When this occurs on 10 or more days per
							month (with mixed use), the risk of developing&nbsp;
							<a
								className='text-sky-300 underline transition-opacity hover:opacity-80'
								href='https://www.ncbi.nlm.nih.gov/books/NBK538150/'
								target='_blank'
								rel='noreferrer'
							>
								MOH
							</a>
							&nbsp; (Medication Overuse Headache) increases.
						</p>
					</>
				}
			>
				<div className='info-chip'>
					<p className='text-xs text-white/55'>
						<span
							data-testid='med-days-count'
							className={`font-medium ${
								medDaysCount === maxMedDaysCount
									? 'text-yellow-400/90'
									: medDaysCount > maxMedDaysCount
										? 'text-red-400/90'
										: 'text-emerald-400/90'
							}`}
						>
							{medDaysCount}
						</span>
						/{maxMedDaysCount} Med-Days this month
					</p>
					<InformationCircleIcon className='h-3.5 w-3.5 text-white/40' data-testid='info-toggle' />
				</div>
			</Tooltip>

			<MedicineCombobox medicines={medicines} onChange={onChange} disabled={disabled} />

			{medicines.map((medicine, index) => (
				<div key={index} className='nested-card'>
					<p className='text-sm font-medium text-white/80'>{medicine.medicine.label}</p>

					<Slider
						id={`taken-${index}`}
						label='Taken'
						min={1}
						max={5}
						value={medicine.taken}
						onChange={(value) => {
							const updated = [...medicines];
							updated[index] = {
								...updated[index],
								taken: value,
								effectiveness: Math.min(updated[index].effectiveness, value),
							};
							onChange(updated);
						}}
						disabled={disabled}
					/>

					<Slider
						id={`eff-${index}`}
						label='Effectiveness'
						min={0}
						max={medicine.taken}
						value={medicine.effectiveness}
						onChange={(value) => {
							const updated = [...medicines];
							updated[index] = {
								...updated[index],
								effectiveness: Math.min(value, updated[index].taken),
							};
							onChange(updated);
						}}
						disabled={disabled}
					/>
				</div>
			))}

			<AddMedicineForm show={showMedicineForm} />
		</div>
	);
}

export default Medicine;
