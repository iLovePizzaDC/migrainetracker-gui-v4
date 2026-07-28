import { UserContext } from '@/shared/context/user/user-context';
import { useContext } from 'react';

export const useUser = () => {
	const context = useContext(UserContext);
	if (!context) throw new Error('useUser must be used within a UserProvider');
	return context;
};
