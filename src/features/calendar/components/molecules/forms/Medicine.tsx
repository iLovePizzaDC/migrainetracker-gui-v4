import MedicineCombobox from '@/features/calendar/components/molecules/MedicineCombobox';
import { useCalendar } from '@/features/calendar/hooks/use-calendar';
import type { AppendMedicine } from '@/shared/types/calendar';
import { InformationCircleIcon, PlusCircleIcon } from '@heroicons/react/24/outline';
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
		<div className='self-start p-4 rounded-xl bg-white/5 border border-white/10 space-y-3'>
			<div className='flex w-full items-center justify-between'>
				<div className='w-5'></div>
				<h3 className='text-sm font-medium text-purple-300 text-center flex-1'>Medicines</h3>
				<button
					data-testid='add-medicine'
					onClick={() => setShowMedicineForm((prev) => !prev)}
					className='hover:opacity-80 transition-opacity w-4'
				>
					<PlusCircleIcon
						className={`w-5 h-5 transition-transform duration-300 ${
							showMedicineForm ? 'rotate-45' : ''
						}`}
					/>
				</button>
			</div>

			<div className='relative inline-flex w-fit items-center p-1 rounded-xl bg-black/10 gap-1 group'>
				<Tooltip
					content={
						<div className='max-w-xs text-xs leading-relaxed'>
							<p>
								A “Med-Day” is any day on which you've taken acute medication (either medication of
								type "migraine-painkiller" or "painkiller"). When this occurs on 10 or more days per
								month (with mixed use), the risk of developing&nbsp;
								<a
									className='underline text-blue-500 hover:opacity-80 transition-opacity'
									href='https://www.ncbi.nlm.nih.gov/books/NBK538150/'
									target='_blank'
								>
									MOH
								</a>
								&nbsp; (Medication Overuse Headache) increases.
							</p>
						</div>
					}
				>
					<div className='flex items-center gap-1'>
						<p className='text-xs font-medium'>
							<span
								data-testid='med-days-count'
								className={`${
									medDaysCount === maxMedDaysCount
										? 'text-yellow-500'
										: medDaysCount > maxMedDaysCount
											? 'text-red-500'
											: 'text-green-500'
								}`}
							>
								{medDaysCount}
							</span>
							/{maxMedDaysCount} Med-Days this month
						</p>

						<InformationCircleIcon className='w-4 h-4' data-testid='info-toggle' />
					</div>
				</Tooltip>
			</div>

			<MedicineCombobox medicines={medicines} onChange={onChange} disabled={disabled} />

			{medicines.map((medicine, index) => (
				<div key={index} className='p-3 rounded-lg bg-transparent border border-white/25 space-y-3'>
					<p className='text-sm font-medium'>{medicine.medicine.label}</p>

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
