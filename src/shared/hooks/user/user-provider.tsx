import { fetchUserMedicinesGet } from '@/shared/api/medicine.api';
import { UserContext } from '@/shared/context/user/user-context';
import type { Medicine } from '@/shared/types/user/medicine';
import type { User } from '@/shared/types/user/user';
import { useCallback, useEffect, useState, type ReactNode } from 'react';

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [medicines, setMedicines] = useState<Medicine[] | null>(null);

  useEffect(() => {
    if (!user) return;

    const loadMedicines = async () => {
      const medicines = await fetchUserMedicinesGet();
      setMedicines(medicines);
    };

    loadMedicines();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  const addMedicine = useCallback((medicine: Medicine) => {
    setMedicines((prev) => {
      if (prev === null) return [medicine];
      if (prev.some((m) => m.abbreviation === medicine.abbreviation)) {
        return prev;
      }
      return [...prev, medicine];
    });
  }, []);

  const removeMedicine = useCallback((abbreviation: string) => {
    setMedicines((prev) => {
      if (prev === null) return null;
      return prev.filter((m) => m.abbreviation !== abbreviation);
    });
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, medicines, addMedicine, removeMedicine }}>
      {children}
    </UserContext.Provider>
  );
};
