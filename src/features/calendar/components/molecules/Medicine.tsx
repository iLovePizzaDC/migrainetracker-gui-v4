import CalendarTooltip from '@/features/calendar/components/atoms/CalendarTooltip';
import Slider from '@/features/calendar/components/atoms/Slider';
import AddMedicineForm from '@/features/calendar/components/molecules/AddMedicineForm';
import MedicineCombobox from '@/features/calendar/components/molecules/MedicineCombobox';
import { useCalendar } from '@/features/calendar/hooks/use-calendar';
import { useClickOutside } from '@/shared/hooks/use-click-outside';
import type { AppendMedicine } from '@/shared/types/calendar/calendar';
import { InformationCircleIcon, PlusCircleIcon } from '@heroicons/react/24/outline';
import { useRef, useState } from 'react';

interface IMedicine {
  medicines: AppendMedicine[];
  setMedicines: React.Dispatch<React.SetStateAction<AppendMedicine[]>>;
  disabled?: boolean;
}

function Medicine({ medicines, setMedicines, disabled }: IMedicine) {
  const { medDaysCount, maxMedDaysCount } = useCalendar();

  const infoRef = useRef<HTMLDivElement>(null);

  const [showInfo, setShowInfo] = useState(false);
  const [showMedicineForm, setShowMedicineForm] = useState(false);

  useClickOutside(infoRef, () => {
    setShowInfo(false);
  });

  return (
    <div className='p-4 rounded-xl bg-white/5 border border-white/10 space-y-3'>
      <div className='flex w-full items-center justify-between'>
        <div className='w-5'></div>
        <h3 className='text-sm font-medium text-purple-300 text-center flex-1'>Medicines</h3>
        <button
          data-testid='add-medicine'
          onClick={() => setShowMedicineForm((prev) => !prev)}
          className='hover:opacity-80 transition-opacity w-4'
        >
          <PlusCircleIcon
            className={`w-5 h-5 transition-transform duration-300 ${showMedicineForm ? 'rotate-45' : ''
              }`}
          />
        </button>
      </div>

      <div className='relative inline-flex w-fit items-center p-1 rounded-xl bg-black/10 gap-1 group'>
        <p className='text-xs font-medium'>
          <span
            data-testid='med-days-count'
            className={`${medDaysCount === maxMedDaysCount
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

        <button
          data-testid='info-toggle'
          onClick={() => setShowInfo((prev) => !prev)}
          className='text-purple-300 hover:opacity-80 transition-opacity'
        >
          <InformationCircleIcon className='w-4 h-4' />
        </button>

        {showInfo && (
          <CalendarTooltip ref={infoRef}>
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
          </CalendarTooltip>
        )}
      </div>

      <MedicineCombobox medicines={medicines} setMedicines={setMedicines} disabled={disabled} />

      {/* TODO if medicine gets removed/added -> value of taken and effectiveness resets */}
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
              updated[index].taken = value;
              setMedicines(updated);
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
              updated[index].effectiveness = value;
              setMedicines(updated);
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
