import Combobox from "@/shared/components/atoms/Combobox";
import DropdownInput from "@/shared/components/atoms/DropdownInput";
import { ANY_OPTION, INTENSITY_OPTIONS, MIDAS_OPTIONS, SYMPTOM_OPTIONS, type IntensityType, type MidasType, type SymptomType } from "@/shared/constants/event/event-details";
import { useUserMedicines } from "@/shared/hooks/user/use-user-medicines";
import type { EventFilter } from "@/shared/types/event/event";
import type { DropdownOption } from "@/shared/types/input/input";

interface IFilterForm {
    variant: 'standard' | 'compact'; // TODO outsource into consts
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

    const baseClasses = variant === "compact"
        ? "space-y-2"
        : "space-y-3 rounded-xl border border-white/10 bg-white/5";

    return (
        <div className={`p-3 ${baseClasses}`}>
            <DropdownInput
                id="filterIntensity"
                label="Intensity"
                value={filter.intensity ?? 'default'}
                options={[ANY_OPTION, ...INTENSITY_OPTIONS]}
                onChange={(event) => {
                    const value = event.target.value;
                    setFilter(prev => ({
                        ...prev,
                        intensity: value === ANY_OPTION.value ? null : (value as IntensityType)
                    }));
                }}
            />
            <Combobox
                id="filterSymptoms"
                label="Symptoms"
                options={[ANY_OPTION, ...SYMPTOM_OPTIONS]}
                selected={filter.symptom
                    .map(symptom => [ANY_OPTION, ...SYMPTOM_OPTIONS].find(option => option.value === symptom))
                    .filter(Boolean) as DropdownOption[]
                }
                onChange={selectedSymptoms => {
                    setFilter(prev => ({
                        ...prev,
                        symptom: selectedSymptoms.map(symptom => symptom.value as SymptomType | 'any')
                    }));
                }}
            />
            {medicineInputVisible &&
                <Combobox
                    id="filterMedicine"
                    label="Medicine"
                    options={[ANY_OPTION, ...userMedicineOptions]}
                    selected={filter.medicine.map(medicine => ({
                        label: medicine.label,
                        value: medicine.abbreviation,
                    }))}
                    onChange={(selectedMedicine) => {
                        setFilter(prev => ({
                            ...prev,
                            medicine: selectedMedicine.map(medicine => ({
                                label: medicine.label,
                                abbreviation: medicine.value,
                            })),
                        }));
                    }}
                />
            }
            {midasInputVisible &&
                <Combobox
                    id="filterMidas"
                    label="Midas"
                    options={MIDAS_OPTIONS}
                    selected={filter.midas
                        .map(value => MIDAS_OPTIONS.find(option => option.value === value))
                        .filter(Boolean) as DropdownOption[]
                    }
                    onChange={(selectedMidas) => {
                        setFilter(prev => ({
                            ...prev,
                            midas: selectedMidas.map(midas => midas.value as MidasType),
                        }));
                    }}
                />
            }
        </div>
    );
}

export default FilterForm;
