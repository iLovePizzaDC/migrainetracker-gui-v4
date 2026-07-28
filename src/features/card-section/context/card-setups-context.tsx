import type { CardSetup } from '@/features/home/types/chart';
import { createContext } from 'react';

interface ICardSetupsContext {
	cardSetups: CardSetup[];
	setCardSetups: React.Dispatch<React.SetStateAction<CardSetup[]>>;
	removeSetupByIndex: (index: number) => void;
	updateSetupByIndex: (updatedSetup: CardSetup) => void;
	appendSetup: (setup: CardSetup) => void;
}

export const CardSetupsContext = createContext<ICardSetupsContext | null>(null);
