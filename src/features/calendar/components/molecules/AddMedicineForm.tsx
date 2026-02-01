import { useCalendar } from "@/features/calendar/hooks/use-calendar";
import { fetchUserMedicinesPost } from "@/shared/api/medicine.api";
import DropdownInput from "@/shared/components/atoms/DropdownInput";
import SubmitButton from "@/shared/components/atoms/SubmitButton";
import TextInput from "@/shared/components/atoms/TextInput";
import { BUTTON_TYPES } from "@/shared/constants/input/button";
import { MEDICINE_OPTIONS, MEDICINE_TYPES, type MedicineType } from "@/shared/constants/user/medicine";
import { useEffect, useRef, useState } from "react";

interface IAddMedicineForm {
    show: boolean;
}

function AddMedicineForm({ show }: IAddMedicineForm) {
    const { loadUserMedicines } = useCalendar();

    const ref = useRef<HTMLDivElement>(null);

    const [name, setName] = useState('');
    const [abbreviation, setAbbreviation] = useState('');
    const [type, setType] = useState<MedicineType>(MEDICINE_TYPES.MIGRAINE_PAINKILLER);
    const [height, setHeight] = useState(0);

    const isFormValid = name.length > 0 && abbreviation.length > 0;

    useEffect(() => {
        const updateHeight = () => {
            if (ref.current) {
                setHeight(show ? ref.current.scrollHeight : 0);
            }
        };

        updateHeight();
    }, [show]);

    const submitForm = async () => {
        if (!isFormValid) return;

        await fetchUserMedicinesPost(name, abbreviation, type);

        loadUserMedicines();

        setName('');
        setAbbreviation('');
        setType(MEDICINE_TYPES.MIGRAINE_PAINKILLER);
    };

    return (
        <div
            className="overflow-hidden transition-all duration-300 ease-in-out"
            style={{ height }}
        >
            <div ref={ref} className="grid gap-3">
                <DropdownInput
                    id="medicineType"
                    label="Type"
                    value={type}
                    options={MEDICINE_OPTIONS}
                    onChange={(value) => {
                        setType(value as MedicineType);
                    }}
                    required
                />
                <TextInput
                    id="medicineName"
                    label="Name"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    placeholder="Name"
                    required
                />
                <TextInput
                    id="medicineAbbreviation"
                    label="Abbreviation"
                    value={abbreviation}
                    onChange={(event) => setAbbreviation(event.target.value)}
                    placeholder="Abbreviation"
                    required
                />

                <SubmitButton
                    type={BUTTON_TYPES.BUTTON}
                    label="Save"
                    onClick={submitForm}
                    disabled={!isFormValid}
                    className="bg-purple-600/50 border-purple-700/20 text-white"
                />
            </div>
        </div>
    );
}

export default AddMedicineForm;
