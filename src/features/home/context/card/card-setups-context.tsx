import { createContext } from 'react';
import type { CardSetup } from '../../types/card/chart';

interface ICardSetupsContext {
    cardSetups: CardSetup[];
    setCardSetups: React.Dispatch<React.SetStateAction<CardSetup[]>>
    removeSetupByIndex: (index: number) => void;
    updateSetupByIndex: (updatedSetup: CardSetup) => void;
    appendSetup: (setup: CardSetup) => void;
}

export const CardSetupsContext = createContext<ICardSetupsContext>({
    cardSetups: [],
    setCardSetups: () => {},
    removeSetupByIndex: () => {},
    updateSetupByIndex: () => {},
    appendSetup: () => {},
});
