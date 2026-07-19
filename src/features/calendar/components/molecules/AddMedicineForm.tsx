import { fetchUserMedicinesPost } from '@/shared/api/medicine.api';
import DropdownInput from '@/shared/components/atoms/DropdownInput';
import SubmitButton from '@/shared/components/atoms/SubmitButton';
import TextInput from '@/shared/components/atoms/TextInput';
import { BUTTON_TYPES } from '@/shared/constants/input/button';
import {
  MEDICINE_OPTIONS,
  MEDICINE_TYPES,
  type MedicineType,
} from '@/shared/constants/user/medicine';
import { useUser } from '@/shared/hooks/user/use-user';
import { useEffect, useRef, useState } from 'react';

interface IAddMedicineForm {
  show: boolean;
}

function AddMedicineForm({ show }: IAddMedicineForm) {
  const ref = useRef<HTMLDivElement>(null);

  const { addMedicine } = useUser();

  const [name, setName] = useState('');
  const [abbreviation, setAbbreviation] = useState('');
  const [type, setType] = useState<MedicineType>(MEDICINE_TYPES.MIGRAINE_PAINKILLER);
  const [height, setHeight] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isFormValid = name.length > 0 && abbreviation.length > 0;

  useEffect(() => {
    const updateHeight = () => {
      if (ref.current) {
        setHeight(show ? ref.current.scrollHeight : 0);
      }
    };

    updateHeight();
  }, [show]);

  const submitForm = async () => {
    if (!isFormValid || isSubmitting) return;

    try {
      setIsSubmitting(true);

      addMedicine({ name, abbreviation, type });

      await fetchUserMedicinesPost(name, abbreviation, type);

      setName('');
      setAbbreviation('');
      setType(MEDICINE_TYPES.MIGRAINE_PAINKILLER);
    } catch (error) {
      console.error('Failed to add medicine:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      data-testid='add-medicine-form'
      className='overflow-hidden transition-all duration-300 ease-in-out'
      style={{ height }}
    >
      <div ref={ref} className='grid gap-3'>
        <DropdownInput
          id='medicineType'
          label='Type'
          value={type}
          options={MEDICINE_OPTIONS}
          onChange={(value) => {
            setType(value as MedicineType);
          }}
          disabled={isSubmitting}
          required
        />
        <TextInput
          id='medicineName'
          label='Name'
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder='Name'
          disabled={isSubmitting}
          required
        />
        <TextInput
          id='medicineAbbreviation'
          label='Abbreviation'
          value={abbreviation}
          onChange={(event) => setAbbreviation(event.target.value)}
          placeholder='Abbreviation'
          disabled={isSubmitting}
          required
        />

        <SubmitButton
          type={BUTTON_TYPES.BUTTON}
          label={isSubmitting ? 'Saving...' : 'Save'}
          onClick={submitForm}
          disabled={!isFormValid || isSubmitting}
          className='bg-purple-600/50 border-purple-700/20 text-white'
        />
      </div>
    </div>
  );
}

export default AddMedicineForm;
