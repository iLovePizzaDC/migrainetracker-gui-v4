import { SYMPTOM_OPTIONS, type SymptomType } from '@/shared/constants/event/event-details';
import { SELECT_TYPES } from '@/shared/constants/input/select';
import SelectInput from '@/features/calendar/components/atoms/inputs/SelectInput';

interface ISymptoms {
	symptoms: SymptomType[];
	onChange: (symptoms: SymptomType[]) => void;
	disabled?: boolean;
}

function Symptoms({ symptoms, onChange, disabled = false }: ISymptoms) {
	return (
		<div data-testid='symptoms' className='form-section'>
			<h3 className='section-title'>Symptoms</h3>
			<SelectInput
				id='symptoms'
				type={SELECT_TYPES.CHECKBOX}
				options={SYMPTOM_OPTIONS}
				value={symptoms}
				onChange={(event) => {
					const value = event.target.value as SymptomType;

					onChange(
						symptoms.includes(value)
							? symptoms.filter((symptom) => symptom !== value)
							: [...symptoms, value],
					);
				}}
				disabled={disabled}
			/>
		</div>
	);
}

export default Symptoms;
