import type { Medicine } from '@/shared/types/medicine';
import type { User } from '@/shared/types/user';
import { createContext } from 'react';

interface IUserContext {
	user: User | null;
	setUser: (user: User | null) => void;
	medicines: Medicine[] | null;
	addMedicine: (medicine: Medicine) => void;
	removeMedicine: (abbreviation: string) => void;
}

export const UserContext = createContext<IUserContext | null>(null);
