import { fetchUserMedicinesDelete } from '@/shared/api/medicine.api';
import Combobox from '@/shared/components/atoms/Combobox';
import { BUTTON_TYPES } from '@/shared/constants/input/button';
import { useClickOutside } from '@/shared/hooks/use-click-outside';
import { useUser } from '@/shared/hooks/user/use-user';
import type { AppendMedicine } from '@/shared/types/calendar/calendar';
import type { DropdownOption } from '@/shared/types/input/input';
import { CheckBadgeIcon, TrashIcon } from '@heroicons/react/24/outline';
import { useRef, useState } from 'react';

interface IMedicineCombobox {
  medicines: AppendMedicine[];
  setMedicines: React.Dispatch<React.SetStateAction<AppendMedicine[]>>;
  disabled?: boolean;
}

function MedicineCombobox({ medicines, setMedicines, disabled }: IMedicineCombobox) {
  const comboboxRef = useRef<HTMLDivElement | null>(null);

  const { medicines: userMedicines, removeMedicine } = useUser();

  const [deletionConfirmedFor, setDeletionConfirmedFor] = useState<string | null>(null);
  const [deletingMedicine, setDeletingMedicine] = useState<string | null>(null);

  useClickOutside(comboboxRef, () => {
    setDeletionConfirmedFor(null);
  });

  const medicineOptions: DropdownOption[] =
    userMedicines === null
      ? []
      : userMedicines.map((m) => ({
        label: m.name,
        value: m.abbreviation,
      }));

  const deleteMedicine = async (name: string, abbreviation: string) => {
    try {
      setDeletingMedicine(abbreviation);

      removeMedicine(abbreviation);

      await fetchUserMedicinesDelete(name, abbreviation);

      setDeletionConfirmedFor(null);
    } catch (error) {
      console.error('Failed to delete medicine:', error);
    } finally {
      setDeletingMedicine(null);
    }
  };

  return (
    <Combobox
      id='meds'
      options={medicineOptions}
      selected={medicines.map((medicine) => ({
        label: medicine.medicine.label,
        value: medicine.medicine.abbreviation,
      }))}
      onChange={(selectedMedicines) => {
        setDeletionConfirmedFor(null);
        setMedicines(
          selectedMedicines.map((medicine) => ({
            medicine: {
              label: medicine.label,
              abbreviation: medicine.value,
            },
            taken: 1,
            effectiveness: 0,
          })),
        );
      }}
      placeholder='Add medicine...'
      disabled={disabled}
      renderOptionActions={(option) => {
        const isConfirming = deletionConfirmedFor === option.value;
        const isDeleting = deletingMedicine === option.value;

        return (
          <button
            type={BUTTON_TYPES.BUTTON}
            aria-label={`Delete ${option.label}`}
            onMouseDown={(event) => event.stopPropagation()}
            onClick={(event) => {
              event.stopPropagation();
              if (isConfirming) {
                deleteMedicine(option.label, option.value);
              } else {
                setDeletionConfirmedFor(option.value);
              }
            }}
            disabled={isDeleting}
            className='hover:text-red-500 transition-colors disabled:opacity-50'
          >
            {isConfirming ? (
              <CheckBadgeIcon data-testid='confirm-icon' className='h-4 w-4' />
            ) : (
              <TrashIcon data-testid='trash-icon' className='h-4 w-4' />
            )}
          </button>
        );
      }}
      ref={comboboxRef}
    />
  );
}

export default MedicineCombobox;
