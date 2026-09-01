import { fetchUserMedicinesPost } from '@/shared/api/medicine.api';
import Reveal from '@/shared/components/atoms/Reveal';
import DropdownInput from '@/shared/components/atoms/inputs/DropdownInput';
import SubmitButton from '@/shared/components/atoms/SubmitButton';
import TextInput from '@/shared/components/atoms/inputs/TextInput';
import { BUTTON_TYPES } from '@/shared/constants/input/button';
import {
	MEDICINE_OPTIONS,
	MEDICINE_TYPES,
	type MedicineType,
} from '@/shared/constants/user/medicine';
import { useUser } from '@/shared/hooks/use-user';
import { useCallback, useMemo, useState } from 'react';

interface IAddMedicineForm {
	show: boolean;
}

function AddMedicineForm({ show }: IAddMedicineForm) {
	const { addMedicine } = useUser();

	const [name, setName] = useState('');
	const [abbreviation, setAbbreviation] = useState('');
	const [type, setType] = useState<MedicineType>(MEDICINE_TYPES.MIGRAINE_PAINKILLER);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const isFormValid = useMemo(
		() => name.length > 0 && abbreviation.length > 0,
		[name, abbreviation],
	);

	const handleTypeChange = useCallback((value: string) => setType(value as MedicineType), []);

	const handleNameChange = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value),
		[],
	);

	const handleAbbrevChange = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => setAbbreviation(e.target.value),
		[],
	);

	const submitForm = useCallback(async () => {
		if (!isFormValid || isSubmitting) return;

		try {
			setIsSubmitting(true);
			setError(null);

			await fetchUserMedicinesPost(name, abbreviation, type);
			addMedicine({ name, abbreviation, type });

			setName('');
			setAbbreviation('');
			setType(MEDICINE_TYPES.MIGRAINE_PAINKILLER);
		} catch {
			setError('Could not save medicine. Please try again.');
		} finally {
			setIsSubmitting(false);
		}
	}, [isFormValid, isSubmitting, addMedicine, name, abbreviation, type]);

	return (
		<Reveal open={show} data-testid='add-medicine-form'>
			<div className='grid gap-3 pt-3'>
				<DropdownInput
					id='medicineType'
					label='Type'
					value={type}
					options={MEDICINE_OPTIONS}
					onChange={handleTypeChange}
					disabled={isSubmitting}
					required
				/>
				<TextInput
					id='medicineName'
					label='Name'
					value={name}
					onChange={handleNameChange}
					placeholder='Name'
					disabled={isSubmitting}
					required
				/>
				<TextInput
					id='medicineAbbreviation'
					label='Abbreviation'
					value={abbreviation}
					onChange={handleAbbrevChange}
					placeholder='Abbreviation'
					disabled={isSubmitting}
					required
				/>

				{error && (
					<p className='form-error' role='alert'>
						{error}
					</p>
				)}

				<SubmitButton
					type={BUTTON_TYPES.BUTTON}
					label='Save'
					loadingLabel='Saving...'
					loading={isSubmitting}
					onClick={submitForm}
					disabled={!isFormValid}
				/>
			</div>
		</Reveal>
	);
}

export default AddMedicineForm;
