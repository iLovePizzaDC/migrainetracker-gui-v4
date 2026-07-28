import { CardSetupsContext } from '@/features/card-section/context/card-setups-context';
import { useContext } from 'react';

export const useCardSetups = () => {
	const context = useContext(CardSetupsContext);
	if (!context) throw new Error('useCardSetups must be used within a CardSetupsProvider');
	return context;
};
