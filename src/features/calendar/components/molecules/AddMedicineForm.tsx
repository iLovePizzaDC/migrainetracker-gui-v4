import { useCalendar } from "@/features/calendar/hooks/use-calendar";
import { fetchUserMedicinesPost } from "@/shared/api/medicine.api";
import DropdownInput from "@/shared/components/atoms/DropdownInput";
import SubmitButton from "@/shared/components/atoms/SubmitButton";
import TextInput from "@/shared/components/atoms/TextInput";
import { BUTTON_TYPES } from "@/shared/constants/input/button";
import { MEDICINE_OPTIONS, MEDICINE_TYPES, type MedicineType } from "@/shared/constants/user/medicine";
import { useState } from "react";

function AddMedicineForm() {
    const { loadUserMedicines } = useCalendar();

    const [name, setName] = useState('');
    const [abbreviation, setAbbreviation] = useState('');
    const [type, setType] = useState<MedicineType>(MEDICINE_TYPES.MIGRAINE_PAINKILLER);

    const isFormValid = name.length > 0 && abbreviation.length > 0;

    const submitForm = async () => {
        if (!isFormValid) return;

        await fetchUserMedicinesPost(name, abbreviation, type);

        loadUserMedicines();

        setName('');
        setAbbreviation('');
        setType(MEDICINE_TYPES.MIGRAINE_PAINKILLER);
    };

    return (
        <div className="grid gap-3">
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
            <DropdownInput
                id="medicineType"
                label="Type"
                value={type}
                options={MEDICINE_OPTIONS}
                onChange={(event) => {
                    const value = event.target.value as MedicineType;
                    setType(value);
                }}
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
    );
}

export default AddMedicineForm;
