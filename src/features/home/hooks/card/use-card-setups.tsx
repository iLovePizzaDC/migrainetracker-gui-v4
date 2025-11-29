import { useContext } from "react";
import { CardSetupsContext } from "../../context/card/card-setups-context";

export const useCardSetups = () => {
    const context = useContext(CardSetupsContext);
    if (!context) throw new Error('useCardSetups must be used within a CardSetupsProvider');
    return context;
};
