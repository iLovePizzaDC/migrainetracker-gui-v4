import Combobox from '@/shared/components/atoms/Combobox';
import DropdownInput from '@/shared/components/atoms/DropdownInput';
import {
	ANY_FILTER_OPTIONS,
	ANY_FILTER_TYPE,
	EFFECTIVENESS_OPTIONS,
	INTENSITY_OPTIONS,
	MIDAS_OPTIONS,
	SYMPTOM_OPTIONS,
	type AnyFilterType,
	type EffectivenessType,
	type IntensityType,
	type MidasType,
	type SymptomType,
} from '@/shared/constants/event/event-details';
import {
	FILTER_FORM_VARIANTS,
	type FilterFormVariant,
} from '@/shared/constants/variants/filter-form';
import { useUserMedicines } from '@/shared/hooks/user/use-user-medicines';
import type { EventFilter } from '@/shared/types/event/event';
import type { DropdownOption } from '@/shared/types/input/input';
import { replaceAnyWithNull } from '@/shared/utils/formatter/filter-replacer';
import { useEffect } from 'react';

interface IFilterForm {
	variant: FilterFormVariant;
	filter: EventFilter;
	setFilter: React.Dispatch<React.SetStateAction<EventFilter>>;
	medicineInputVisible?: boolean;
	midasInputVisible?: boolean;
}

function FilterForm({
	variant,
	filter,
	setFilter,
	medicineInputVisible = true,
	midasInputVisible = true,
}: IFilterForm) {
	const { userMedicineOptions } = useUserMedicines();

	const baseClasses =
		variant === FILTER_FORM_VARIANTS.COMPACT
			? 'space-y-2'
			: 'space-y-3 rounded-xl border border-white/10 bg-white/5';

	useEffect(() => {
		replaceAnyWithNull<EventFilter>(filter);
	}, [filter]);

	return (
		<div data-testid='filter-form' className={`p-3 ${baseClasses}`}>
			<DropdownInput
				id='filterIntensity'
				label='Intensity'
				value={filter.intensity ?? ANY_FILTER_TYPE.ANY}
				options={[ANY_FILTER_OPTIONS, ...INTENSITY_OPTIONS]}
				onChange={(value) => {
					setFilter((prev) => ({
						...prev,
						intensity: value as IntensityType,
					}));
				}}
			/>
			<Combobox
				id='filterSymptoms'
				label='Symptoms'
				options={[ANY_FILTER_OPTIONS, ...SYMPTOM_OPTIONS]}
				selected={
					filter.symptom
						.map((symptom) =>
							[ANY_FILTER_OPTIONS, ...SYMPTOM_OPTIONS].find((option) => option.value === symptom),
						)
						.filter(Boolean) as DropdownOption[]
				}
				onChange={(selectedSymptoms) => {
					setFilter((prev) => ({
						...prev,
						symptom: selectedSymptoms.map(
							(symptom) => symptom.value as SymptomType | AnyFilterType,
						),
					}));
				}}
			/>
			{medicineInputVisible && (
				<>
					<Combobox
						id='filterMedicine'
						label='Medicine'
						options={[ANY_FILTER_OPTIONS, ...userMedicineOptions]}
						selected={filter.medicine.map((medicine) => ({
							label: medicine.label,
							value: medicine.abbreviation,
						}))}
						onChange={(selectedMedicine) => {
							setFilter((prev) => ({
								...prev,
								medicine: selectedMedicine.map((medicine) => ({
									label: medicine.label,
									abbreviation: medicine.value,
								})),
							}));
						}}
					/>

					<DropdownInput
						id='filterEffectiveness'
						label='Effectiveness'
						value={filter.effectiveness ?? ANY_FILTER_TYPE.ANY}
						options={[ANY_FILTER_OPTIONS, ...EFFECTIVENESS_OPTIONS]}
						onChange={(value) => {
							setFilter((prev) => ({
								...prev,
								effectiveness: value as EffectivenessType,
							}));
						}}
					/>
				</>
			)}
			{midasInputVisible && ( // TODO add tests
				<Combobox
					id='filterMidas'
					label='Midas'
					options={[ANY_FILTER_OPTIONS, ...MIDAS_OPTIONS]}
					selected={
						filter.midas
							.map((value) =>
								[ANY_FILTER_OPTIONS, ...MIDAS_OPTIONS].find((option) => option.value === value),
							)
							.filter(Boolean) as DropdownOption[]
					}
					onChange={(selectedMidas) => {
						setFilter((prev) => ({
							...prev,
							midas: selectedMidas.map((midas) => midas.value as MidasType | AnyFilterType),
						}));
					}}
				/>
			)}
		</div>
	);
}

export default FilterForm;
