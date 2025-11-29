import { useEffect, useState, type ReactNode } from "react";
import { CardSetupsContext } from "../../context/card/card-setups-context";
import type { CardSetup } from "../../types/card/chart";
import { SETUP_STORAGE_KEY } from "../../constants/card/setups";

export const CardSetupsProvider = ({ children }: { children: ReactNode }) => {
    const [cardSetups, setCardSetups] = useState<CardSetup[]>(() => {
        try {
            const saved = localStorage.getItem(SETUP_STORAGE_KEY);
            return saved ? JSON.parse(saved) : [];
        } catch {
            return [];
        }
    });

    useEffect(() => {
        localStorage.setItem(SETUP_STORAGE_KEY, JSON.stringify(cardSetups));
    }, [cardSetups]);

    const normalizeIndexes = (setups: CardSetup[]): CardSetup[] => {
        return setups
            .map((setup, index) => ({ ...setup, index: index }));
    };

    const removeSetupByIndex = (index: number) => {
        setCardSetups(prev =>
            normalizeIndexes(prev.filter(setup => setup.index !== index))
        );
    };

    const updateSetupByIndex = (updatedSetup: CardSetup) => {
        setCardSetups(prev =>
            normalizeIndexes(
                prev.map(setup =>
                    setup.index === updatedSetup.index ? { ...updatedSetup } : setup
                )
            )
        );
    };

    const appendSetup = (setup: CardSetup) => {
        setCardSetups(prev => normalizeIndexes([...prev, setup]));
    };

    return (
        <CardSetupsContext.Provider value={{ cardSetups, setCardSetups, removeSetupByIndex, updateSetupByIndex, appendSetup }}>
            {children}
        </CardSetupsContext.Provider>
    );
};
