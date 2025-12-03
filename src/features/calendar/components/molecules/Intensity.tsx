import { INTENSITY_OPTIONS, type IntensityType } from "../../constants/calendar";
import SelectInput from "../atoms/SelectInput";

interface IIntensity {
    intensity: IntensityType;
    setIntensity: React.Dispatch<React.SetStateAction<IntensityType>>;
    disabled?: boolean;
}

function Intensity({ intensity, setIntensity, disabled = false }: IIntensity) {

    return (
        <div className="p-4 rounded-xl bg-white/5 border border-white/10">
            <h3 className="text-sm font-medium text-purple-300 mb-2">
                Intensity
            </h3>

            <SelectInput
                id="intensity"
                type="radio"
                label=""
                options={INTENSITY_OPTIONS}
                value={intensity}
                onChange={event => setIntensity(event.target.value as IntensityType)}
                disabled={disabled}
            />
        </div>
    );
}

export default Intensity;
