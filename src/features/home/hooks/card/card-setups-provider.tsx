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

    return (
        <CardSetupsContext.Provider value={{ cardSetups, setCardSetups }}>
            {children}
        </CardSetupsContext.Provider>
    );
};
