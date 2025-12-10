import Combobox from "@/features/calendar/components/atoms/Combobox";
import { INTENSITY_OPTIONS, MIDAS_OPTIONS, SYMPTOM_OPTIONS, type IntensityType, type MidasType, type SymptomType } from "@/features/calendar/constants/calendar";
import { useCalendar } from "@/features/calendar/hooks/use-calendar";
import DropdownInput from "@/features/home/components/atoms/card/DropdownInput";
import type { DropdownOption } from "@/shared/types";
import { FunnelIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { useEffect, useRef, useState } from "react";

const ANY_OPTION: DropdownOption = { value: 'any', label: 'Any' };

// TODO same styled as other component contextmenu?
function FilterCard() {
    const { userMedicineOptions, filter, setFilter } = useCalendar();

    const [filterOpen, setFilterOpen] = useState(false);

    const cardRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (cardRef.current && !cardRef.current.contains(event.target as Node)) {
                setFilterOpen(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="fixed bottom-5 right-5 z-50">
            <div className="relative">
                <button
                    onClick={() => setFilterOpen((prev) => !prev)}
                    className="p-4 rounded-full bg-white/10 hover:opacity-80 transition-opacity backdrop-blur-sm"
                >
                    <FunnelIcon className="h-6 w-6" />
                </button>

                {filterOpen && (
                    <div
                        ref={cardRef}
                        className="absolute bottom-full right-0 mb-2 w-64 p-4 rounded-2xl bg-transparent backdrop-blur-xl border border-white/20 shadow-lg shadow-black/30"
                    >
                        <div className="flex justify-between items-center mb-2">
                            <h3 className="font-semibold text-white">Filter</h3>
                            <button onClick={() => setFilterOpen(false)}>
                                <XMarkIcon className="h-5 w-5 text-white" />
                            </button>
                        </div>
                        <div className="flex flex-col gap-2 text-white">
                            <DropdownInput
                                id="filterIntensity"
                                label="Intensity"
                                value={filter.intensity ?? 'default'}
                                options={[{ value: 'default', label: 'No filter' }, ...INTENSITY_OPTIONS]}
                                onChange={(event) => {
                                    const value = event.target.value;
                                    setFilter(prev => ({
                                        ...prev,
                                        intensity: value === "default" ? null : (value as IntensityType)
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
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default FilterCard;
