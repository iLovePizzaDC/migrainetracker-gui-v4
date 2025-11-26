import { useState, type ReactNode } from "react";
import type { User } from "../../types";
import { UserContext } from "../../context/user/user-context";

export const UserProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    return (
        <UserContext.Provider value={{ user, setUser }}>
            {children}
        </UserContext.Provider>
    );
};
