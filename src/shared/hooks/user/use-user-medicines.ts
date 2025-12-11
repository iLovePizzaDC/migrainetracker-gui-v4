import { fetchUserMedicinesGet } from "@/shared/api/medicine.api";
import { useUser } from "@/shared/hooks/user/use-user";
import type { DropdownOption } from "@/shared/types/input/input";
import type { Medicine } from "@/shared/types/user/medicine";
import { useEffect, useState } from "react";

export function useUserMedicines() {
    const { user } = useUser();

    const [userMedicineOptions, setUserMedicineOptions] = useState<DropdownOption[]>([]);

    useEffect(() => {
        const load = async () => {
            if (!user) return;
            const meds: Medicine[] = await fetchUserMedicinesGet(user.id);
            setUserMedicineOptions(
                meds.map(m => ({
                    label: m.name,
                    value: m.abbreviation
                }))
            );
        };

        load();
    }, [user]);

    return {
        userMedicineOptions,
    };
}
