import { fetchUserMedicinesGet } from '@/shared/api/medicine.api';
import { useUser } from '@/shared/hooks/user/use-user';
import type { DropdownOption } from '@/shared/types/input/input';
import type { Medicine } from '@/shared/types/user/medicine';
import { useCallback, useEffect, useState } from 'react';

export function useUserMedicines() {
	const { user } = useUser();
	const [userMedicineOptions, setUserMedicineOptions] = useState<DropdownOption[]>([]);

	const loadUserMedicines = useCallback(async () => {
		const meds: Medicine[] = await fetchUserMedicinesGet();
		setUserMedicineOptions(
			meds.map((m) => ({
				label: m.name,
				value: m.abbreviation,
			})),
		);
	}, []);

	useEffect(() => {
		if (!user) return;

		const run = () => {
			loadUserMedicines();
		};

		run();
	}, [user, loadUserMedicines]);

	return {
		userMedicineOptions,
		loadUserMedicines,
	};
}
