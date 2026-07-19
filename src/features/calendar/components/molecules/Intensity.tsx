import SelectInput from '@/features/calendar/components/atoms/SelectInput';
import { INTENSITY_OPTIONS, type IntensityType } from '@/shared/constants/event/event-details';
import { SELECT_TYPES } from '@/shared/constants/input/select';

interface IIntensity {
  intensity: IntensityType;
  setIntensity: React.Dispatch<React.SetStateAction<IntensityType>>;
  disabled?: boolean;
}

function Intensity({ intensity, setIntensity, disabled = false }: IIntensity) {
  return (
    <div data-testid='intensity' className='p-4 rounded-xl bg-white/5 border border-white/10'>
      <h3 className='text-sm font-medium text-purple-300 mb-2'>Intensity</h3>

      <SelectInput
        id='intensity'
        type={SELECT_TYPES.RADIO}
        options={INTENSITY_OPTIONS}
        value={intensity}
        onChange={(event) => setIntensity(event.target.value as IntensityType)}
        disabled={disabled}
      />
    </div>
  );
}

export default Intensity;
