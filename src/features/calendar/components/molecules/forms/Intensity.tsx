import SelectInput from '@/features/calendar/components/atoms/inputs/SelectInput';
import { INTENSITY_OPTIONS, type IntensityType } from '@/shared/constants/event/event-details';
import { SELECT_TYPES } from '@/shared/constants/input/select';

interface IIntensity {
	intensity: IntensityType;
	onChange: (intensity: IntensityType) => void;
	disabled?: boolean;
}

function Intensity({ intensity, onChange, disabled = false }: IIntensity) {
	return (
		<div data-testid='intensity' className='form-section'>
			<h3 className='section-title'>Intensity</h3>
			<SelectInput
				id='intensity'
				type={SELECT_TYPES.RADIO}
				options={INTENSITY_OPTIONS}
				value={intensity}
				onChange={(event) => onChange(event.target.value as IntensityType)}
				disabled={disabled}
			/>
		</div>
	);
}

export default Intensity;
