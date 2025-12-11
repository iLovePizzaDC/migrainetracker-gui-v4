import Slider from "@/features/calendar/components/atoms/Slider";
import { useCalendar } from "@/features/calendar/hooks/use-calendar";
import Combobox from "@/shared/components/atoms/Combobox";
import { useClickOutside } from "@/shared/hooks/use-click-outside";
import type { AppendMedicine } from "@/shared/types/calendar/calendar";
import { InformationCircleIcon } from "@heroicons/react/24/outline";
import { useRef, useState } from "react";

interface IMedicine {
    medicines: AppendMedicine[];
    setMedicines: React.Dispatch<React.SetStateAction<AppendMedicine[]>>;
    disabled?: boolean;
}

function Medicine({ medicines, setMedicines, disabled }: IMedicine) {
    const { userMedicineOptions, medDaysCount, maxMedDaysCount } = useCalendar();

    const infoRef = useRef<HTMLDivElement>(null);

    const [showInfo, setShowInfo] = useState(false);

    useClickOutside(infoRef, setShowInfo);

    return (
        <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-3">
            <h3 className="text-sm font-medium text-purple-300">
                Medicines
            </h3>

            <div className="relative inline-flex w-fit items-center p-1 rounded-xl bg-black/10 gap-1 group">
                <p className='text-xs font-medium'>
                    <span
                        className={`${medDaysCount === maxMedDaysCount
                            ? 'text-yellow-500'
                            : medDaysCount > maxMedDaysCount
                                ? 'text-red-500'
                                : 'text-green-500'
                        }`}
                    >
                        {medDaysCount}
                    </span>
                    /{maxMedDaysCount} Med-Days this month
                </p>

                <button
                    onClick={() => setShowInfo((prev) => !prev)}
                    className="text-purple-300 hover:opacity-80 transition-opacity"
                >
                    <InformationCircleIcon className="w-4 h-4" />
                </button>

                {showInfo && (
                    <div
                        ref={infoRef}
                        className="absolute left-1/2 top-6 -translate-x-1/2 z-50 w-64 rounded-lg bg-black/60 backdrop-blur border border-white/10 p-3 text-xs shadow-xl animate-fade-in"
                    >
                        <p>
                            A “Med-Day” is any day on which you've taken acute medication (either medication of type
                            "migraine-painkiller" or "painkiller").
                            When this occurs on 10 or more days per month (with mixed use), the risk of developing&nbsp;
                            <a className="underline text-blue-500 hover:opacity-80 transition-opacity" href="https://www.ncbi.nlm.nih.gov/books/NBK538150/" target="_blank">MOH</a>&nbsp;
                            (Medication Overuse Headache) increases.
                        </p>
                    </div>
                )}
            </div>


            <Combobox
                id="meds"
                label=""
                options={userMedicineOptions}
                selected={medicines.map(medicine => ({
                    label: medicine.medicine.label,
                    value: medicine.medicine.abbreviation
                }))}
                onChange={selectedMedicines => {
                    setMedicines(
                        selectedMedicines.map(medicine => ({
                            medicine: {
                                label: medicine.label,
                                abbreviation: medicine.value
                            },
                            taken: 1,
                            effectiveness: 0
                        }))
                    );
                }}
                placeholder="Add medicine..."
                disabled={disabled}
            />

            {medicines.map((medicine, index) => (
                <div
                    key={index}
                    className="p-3 rounded-lg bg-transparent border border-white/25 space-y-3"
                >
                    <p className="text-sm font-medium">{medicine.medicine.label}</p>

                    <Slider
                        id={`taken-${index}`}
                        label="Taken"
                        min={1}
                        max={5}
                        value={medicine.taken}
                        onChange={value => {
                            const updated = [...medicines];
                            updated[index].taken = value;
                            setMedicines(updated);
                        }}
                        disabled={disabled}
                    />

                    <Slider
                        id={`eff-${index}`}
                        label="Effectiveness"
                        min={0}
                        max={medicine.taken}
                        value={medicine.effectiveness}
                        onChange={value => {
                            const updated = [...medicines];
                            updated[index].effectiveness = value;
                            setMedicines(updated);
                        }}
                        disabled={disabled}
                    />
                </div>
            ))}
        </div>
    );
}

export default Medicine;
