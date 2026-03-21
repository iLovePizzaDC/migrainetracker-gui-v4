import type { User } from '@/shared/types/user/user';
import { createContext } from 'react';

interface IUserContext {
	user: User | null;
	setUser: (user: User | null) => void;
}

export const UserContext = createContext<IUserContext | null>(null);
