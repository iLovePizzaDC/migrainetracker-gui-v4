import { createContext } from 'react';
import type { User } from '../../types';

interface IUserContext {
    user: User | null;
    setUser: (user: User) => void;
}

export const UserContext = createContext<IUserContext | null>(null);
