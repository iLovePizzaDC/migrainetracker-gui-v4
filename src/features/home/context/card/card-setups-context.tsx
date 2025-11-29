import { createContext } from 'react';
import type { CardSetup } from '../../types/card/chart';

interface ICardSetupsContext {
    cardSetups: CardSetup[];
    setCardSetups: React.Dispatch<React.SetStateAction<CardSetup[]>>
}

export const CardSetupsContext = createContext<ICardSetupsContext>({
    cardSetups: [],
    setCardSetups: () => {},
});
