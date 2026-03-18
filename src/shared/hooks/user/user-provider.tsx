import { UserContext } from '@/shared/context/user/user-context';
import type { User } from '@/shared/types/user/user';
import { useState, type ReactNode } from 'react';

export const UserProvider = ({ children }: { children: ReactNode }) => {
	const [user, setUser] = useState<User | null>(null);
	return <UserContext.Provider value={{ user, setUser }}>{children}</UserContext.Provider>;
};
