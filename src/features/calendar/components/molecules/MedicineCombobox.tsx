import { useCalendar } from "@/features/calendar/hooks/use-calendar";
import { fetchUserMedicinesDelete } from "@/shared/api/medicine.api";
import Combobox from "@/shared/components/atoms/Combobox";
import { BUTTON_TYPES } from "@/shared/constants/input/button";
import { useClickOutside } from "@/shared/hooks/use-click-outside";
import type { AppendMedicine } from "@/shared/types/calendar/calendar";
import { CheckBadgeIcon, TrashIcon } from "@heroicons/react/24/outline";
import { useRef, useState } from "react";

interface IMedicineCombobox {
    medicines: AppendMedicine[];
    setMedicines: React.Dispatch<React.SetStateAction<AppendMedicine[]>>;
    disabled?: boolean;
}

function MedicineCombobox({ medicines, setMedicines, disabled }: IMedicineCombobox) {
    const comboboxRef = useRef<HTMLDivElement | null>(null);

    const { userMedicineOptions, loadUserMedicines } = useCalendar();

    const [deletionConfirmedFor, setDeletionConfirmedFor] = useState<string | null>(null);

    useClickOutside(comboboxRef, () => {
        setDeletionConfirmedFor(null);
    });

    const deleteMedicine = async (name: string, abbreviation: string) => {
        await fetchUserMedicinesDelete(name, abbreviation);

        loadUserMedicines();
    };

    return (
        <Combobox
            id="meds"
            options={userMedicineOptions}
            selected={medicines.map(medicine => ({
                label: medicine.medicine.label,
                value: medicine.medicine.abbreviation
            }))}
            onChange={selectedMedicines => {
                setDeletionConfirmedFor(null);
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
            renderOptionActions={(option) => {
                const isConfirming = deletionConfirmedFor === option.value;

                return (
                    <button
                        type={BUTTON_TYPES.BUTTON}
                        onMouseDown={(event) => event.stopPropagation()}
                        onClick={(event) => {
                            event.stopPropagation();
                            if (isConfirming) {
                                deleteMedicine(option.label, option.value);
                                setDeletionConfirmedFor(null);
                            } else {
                                setDeletionConfirmedFor(option.value);
                            }
                        }}
                        className="hover:text-red-500 transition-colors"
                    >
                        {isConfirming ? (
                            <CheckBadgeIcon className="h-4 w-4" />
                        ) : (
                            <TrashIcon className="h-4 w-4" />
                        )}
                    </button>
                );
            }}
            ref={comboboxRef}
        />
    );
}

export default MedicineCombobox;
