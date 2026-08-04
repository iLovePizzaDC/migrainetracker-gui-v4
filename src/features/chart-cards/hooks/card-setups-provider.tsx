import { SETUP_STORAGE_KEY } from '@/features/chart-cards/constants/setups';
import { CardSetupsContext } from '@/features/chart-cards/context/card-setups-context';
import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { CardSetup } from '@/features/chart-cards/types/card';

export const CardSetupsProvider = ({ children }: { children: ReactNode }) => {
	const [cardSetups, setCardSetups] = useState<CardSetup[]>(() => {
		try {
			if (typeof window === 'undefined') return [];

			const saved = localStorage.getItem(SETUP_STORAGE_KEY);

			if (!saved) return [];

			const parsed = JSON.parse(saved);
			return Array.isArray(parsed) ? parsed : [];
		} catch {
			return [];
		}
	});

	useEffect(() => {
		try {
			if (typeof window === 'undefined') return;
			localStorage.setItem(SETUP_STORAGE_KEY, JSON.stringify(cardSetups));
		} catch (err) {
			console.warn('Failed to persist card setups', err);
		}
	}, [cardSetups]);

	const normalizeIndexes = useCallback((setups: CardSetup[]): CardSetup[] => {
		return setups.map((setup, index) => ({ ...setup, index }));
	}, []);

	const removeSetupByIndex = useCallback(
		(index: number) => {
			setCardSetups((prev) => normalizeIndexes(prev.filter((s) => s.index !== index)));
		},
		[normalizeIndexes],
	);

	const updateSetupByIndex = useCallback(
		(updatedSetup: CardSetup) => {
			setCardSetups((prev) =>
				normalizeIndexes(
					prev.map((setup) => (setup.index === updatedSetup.index ? { ...updatedSetup } : setup)),
				),
			);
		},
		[normalizeIndexes],
	);

	const appendSetup = useCallback(
		(setup: CardSetup) => {
			setCardSetups((prev) => normalizeIndexes([...prev, setup]));
		},
		[normalizeIndexes],
	);

	const value = useMemo(
		() => ({
			cardSetups,
			setCardSetups,
			removeSetupByIndex,
			updateSetupByIndex,
			appendSetup,
		}),
		[cardSetups, removeSetupByIndex, updateSetupByIndex, appendSetup],
	);

	return <CardSetupsContext.Provider value={value}>{children}</CardSetupsContext.Provider>;
};
