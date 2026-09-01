import Combobox from '@/shared/components/atoms/inputs/Combobox';
import DropdownInput from '@/shared/components/atoms/inputs/DropdownInput';
import Reveal from '@/shared/components/atoms/Reveal';
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
import { useUser } from '@/shared/hooks/use-user';
import type { EventFilter } from '@/shared/types/event';
import type { DropdownOption } from '@/shared/types/input';
import { PlusIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';

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
	const { medicines } = useUser();

	const [isOpen, setIsOpen] = useState(variant !== FILTER_FORM_VARIANTS.STANDARD);

	const medicineOptions: DropdownOption[] =
		medicines === null
			? []
			: medicines.map((m) => ({
					label: m.name,
					value: m.abbreviation,
				}));

	const baseClasses = variant === FILTER_FORM_VARIANTS.COMPACT ? '' : 'glass-panel-soft';

	return (
		<div data-testid='filter-form' className={baseClasses || undefined}>
			{variant === FILTER_FORM_VARIANTS.STANDARD && (
				<button
					type='button'
					onClick={() => setIsOpen((prev) => !prev)}
					className='flex w-full items-center justify-between p-3 text-left'
				>
					<span className='card-title'>Filters</span>
					<PlusIcon
						className={`h-5 w-5 text-white/50 icon-spin ${isOpen ? 'icon-spin-open' : ''}`}
					/>
				</button>
			)}

			<Reveal open={variant === FILTER_FORM_VARIANTS.COMPACT || isOpen}>
				<div className='space-y-3 p-3'>
					<DropdownInput
						id='filterIntensity'
						label='Intensity'
						value={filter.intensity ?? ANY_FILTER_TYPE.ANY}
						options={[ANY_FILTER_OPTIONS, ...INTENSITY_OPTIONS]}
						onChange={(value) => {
							setFilter((prev) => ({
								...prev,
								intensity: value === ANY_FILTER_TYPE.ANY ? null : (value as IntensityType),
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
									[ANY_FILTER_OPTIONS, ...SYMPTOM_OPTIONS].find(
										(option) => option.value === symptom,
									),
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
								options={[ANY_FILTER_OPTIONS, ...medicineOptions]}
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
										effectiveness:
											value === ANY_FILTER_TYPE.ANY ? null : (value as EffectivenessType),
									}));
								}}
							/>
						</>
					)}
					{midasInputVisible && (
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
			</Reveal>
		</div>
	);
}

export default FilterForm;
