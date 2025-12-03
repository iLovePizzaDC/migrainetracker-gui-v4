import type { AppendMedicine } from "../../../../shared/types";
import Combobox from "../atoms/Combobox";
import Slider from "../atoms/Slider";
import { useCalendar } from "../../hooks/use-calendar";

interface IMedicine {
    medicines: AppendMedicine[];
    setMedicines: React.Dispatch<React.SetStateAction<AppendMedicine[]>>;
    disabled?: boolean;
}

function Medicine({ medicines, setMedicines, disabled }: IMedicine) {
    const { userMedicineOptions } = useCalendar();

    return (
        <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-3">
            <h3 className="text-sm font-medium text-purple-300">
                Medicines
            </h3>

            {!disabled &&
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
                    disabled={disabled}
                />
            }

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
