import type { User } from '@/shared/types';
import { createContext } from 'react';

interface IUserContext {
    user: User | null;
    setUser: (user: User) => void;
}

export const UserContext = createContext<IUserContext | null>(null);
