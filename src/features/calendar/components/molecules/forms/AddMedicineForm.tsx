import { fetchUserMedicinesPost } from '@/shared/api/medicine.api';
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
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

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

	useEffect(() => {
		const updateHeight = () => {
			if (ref.current) {
				setHeight(show ? ref.current.scrollHeight : 0);
			}
		};

		updateHeight();
	}, [show]);

	const submitForm = useCallback(async () => {
		if (!isFormValid || isSubmitting) return;

		try {
			setIsSubmitting(true);

			await fetchUserMedicinesPost(name, abbreviation, type);
			addMedicine({ name, abbreviation, type });

			setName('');
			setAbbreviation('');
			setType(MEDICINE_TYPES.MIGRAINE_PAINKILLER);
		} catch (error) {
			console.error('Failed to add medicine:', error);
		} finally {
			setIsSubmitting(false);
		}
	}, [isFormValid, isSubmitting, addMedicine, name, abbreviation, type]);

	return (
		<div
			data-testid='add-medicine-form'
			className='overflow-hidden transition-[height,opacity] duration-350 ease-smooth'
			style={{ height }}
		>
			<div ref={ref} className='grid gap-3'>
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

				<SubmitButton
					type={BUTTON_TYPES.BUTTON}
					label={isSubmitting ? 'Saving...' : 'Save'}
					onClick={submitForm}
					disabled={!isFormValid || isSubmitting}
				/>
			</div>
		</div>
	);
}

export default AddMedicineForm;
