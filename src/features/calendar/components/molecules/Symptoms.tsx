import { SYMPTOM_OPTIONS, type SymptomType } from "../../constants/calendar";
import SelectInput from "../atoms/SelectInput";

interface ISymptoms {
    symptoms: SymptomType[];
    setSymptoms: React.Dispatch<React.SetStateAction<SymptomType[]>>;
    disabled?: boolean;
}

function Symptoms({ symptoms, setSymptoms, disabled = false }: ISymptoms) {

    return (
        <div className="p-4 rounded-xl bg-white/5 border border-white/10">
            <h3 className="text-sm font-medium text-purple-300 mb-2">
                Symptome
            </h3>

            <SelectInput
                id="symptoms"
                type="checkbox"
                label=""
                options={SYMPTOM_OPTIONS}
                value={symptoms}
                onChange={event => {
                    const value = event.target.value as SymptomType;
                    setSymptoms(prev =>
                        prev.includes(value)
                            ? prev.filter(x => x !== value)
                            : [...prev, value]
                    );
                }}
                disabled={disabled}
            />
        </div>
    );
}

export default Symptoms;
