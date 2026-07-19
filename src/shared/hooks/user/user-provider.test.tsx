import { fetchUserMedicinesGet } from '@/shared/api/medicine.api';
import { UserContext } from '@/shared/context/user/user-context';
import { UserProvider } from '@/shared/hooks/user/user-provider';
import type { Medicine } from '@/shared/types/user/medicine';
import { act, render, renderHook, screen, waitFor } from '@testing-library/react';
import { useContext } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/shared/api/medicine.api');

const mockMedicines: Medicine[] = [
  { id: 'med-1', name: 'Medicine 1', abbreviation: 'med_1', type: 'painkiller' } as Medicine,
  {
    id: 'med-2',
    name: 'Medicine 2',
    abbreviation: 'med_2',
    type: 'migraine-painkiller',
  } as Medicine,
];

const mockUser = { id: 'user-1', name: 'Test User' } as any;

function renderWithProvider() {
  const { result } = renderHook(() => useContext(UserContext), {
    wrapper: ({ children }) => <UserProvider>{children}</UserProvider>,
  });
  return result as { current: NonNullable<typeof result.current> };
}

describe('UserProvider', () => {
  beforeEach(() => {
    vi.mocked(fetchUserMedicinesGet).mockResolvedValue(mockMedicines);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('initial state', () => {
    it('provides user as null initially', () => {
      const result = renderWithProvider();

      expect(result.current.user).toBeNull();
    });

    it('provides medicines as null initially', () => {
      const result = renderWithProvider();

      expect(result.current.medicines).toBeNull();
    });
  });

  describe('setUser', () => {
    it('provides setUser function', () => {
      const result = renderWithProvider();

      expect(typeof result.current.setUser).toBe('function');
    });

    it('updates user when setUser is called', async () => {
      const result = renderWithProvider();

      await act(async () => {
        result.current.setUser(mockUser);
      });

      expect(result.current.user).toEqual(mockUser);
    });
  });

  describe('loadMedicines', () => {
    it('loads medicines when user is set', async () => {
      const result = renderWithProvider();

      await act(async () => {
        result.current.setUser(mockUser);
      });

      await waitFor(() => {
        expect(result.current.medicines).toEqual(mockMedicines);
      });

      expect(vi.mocked(fetchUserMedicinesGet)).toHaveBeenCalled();
    });

    it('does not load medicines when user is null', () => {
      renderWithProvider();

      expect(vi.mocked(fetchUserMedicinesGet)).not.toHaveBeenCalled();
    });

    it('reloads medicines when user id changes', async () => {
      const result = renderWithProvider();

      await act(async () => {
        result.current.setUser(mockUser);
      });

      await waitFor(() => {
        expect(result.current.medicines).toEqual(mockMedicines);
      });

      const user2 = { id: 'user-2', name: 'Another User' } as any;

      await act(async () => {
        result.current.setUser(user2);
      });

      await waitFor(() => {
        expect(vi.mocked(fetchUserMedicinesGet)).toHaveBeenCalledTimes(2);
      });
    });
  });

  describe('addMedicine', () => {
    it('provides addMedicine function', () => {
      const result = renderWithProvider();

      expect(typeof result.current.addMedicine).toBe('function');
    });

    it('adds medicine to empty list', () => {
      const result = renderWithProvider();
      const newMedicine = { abbreviation: 'new_med', name: 'New Medicine' } as Medicine;

      act(() => {
        result.current.addMedicine(newMedicine);
      });

      expect(result.current.medicines).toEqual([newMedicine]);
    });

    it('adds medicine to existing list', async () => {
      const result = renderWithProvider();

      await act(async () => {
        result.current.setUser(mockUser);
      });

      await waitFor(() => {
        expect(result.current.medicines).toEqual(mockMedicines);
      });

      const newMedicine = { abbreviation: 'new_med', name: 'New Medicine' } as Medicine;

      act(() => {
        result.current.addMedicine(newMedicine);
      });

      expect(result.current.medicines).toContainEqual(newMedicine);
      expect(result.current.medicines?.length).toBe(mockMedicines.length + 1);
    });

    it('does not add duplicate medicine', async () => {
      const result = renderWithProvider();
      const duplicateMedicine = mockMedicines[0];

      await act(async () => {
        result.current.setUser(mockUser);
      });

      await waitFor(() => {
        expect(result.current.medicines).toEqual(mockMedicines);
      });

      act(() => {
        result.current.addMedicine(duplicateMedicine);
      });

      expect(result.current.medicines).toEqual(mockMedicines);
    });

    it('adds medicine when medicines is null', () => {
      const result = renderWithProvider();
      const newMedicine = { abbreviation: 'new_med', name: 'New Medicine' } as Medicine;

      act(() => {
        result.current.addMedicine(newMedicine);
      });

      expect(result.current.medicines).toEqual([newMedicine]);
    });
  });

  describe('removeMedicine', () => {
    it('provides removeMedicine function', () => {
      const result = renderWithProvider();

      expect(typeof result.current.removeMedicine).toBe('function');
    });

    it('removes medicine from list', async () => {
      const result = renderWithProvider();

      await act(async () => {
        result.current.setUser(mockUser);
      });

      await waitFor(() => {
        expect(result.current.medicines).toEqual(mockMedicines);
      });

      act(() => {
        result.current.removeMedicine('med_1');
      });

      expect(result.current.medicines).toEqual([mockMedicines[1]]);
    });

    it('removes last medicine and returns empty list', async () => {
      const result = renderWithProvider();

      await act(async () => {
        result.current.setUser(mockUser);
      });

      await waitFor(() => {
        expect(result.current.medicines).toEqual(mockMedicines);
      });

      act(() => {
        result.current.removeMedicine('med_1');
        result.current.removeMedicine('med_2');
      });

      expect(result.current.medicines).toEqual([]);
    });

    it('returns null when removing from null medicines', () => {
      const result = renderWithProvider();

      act(() => {
        result.current.removeMedicine('any_abbreviation');
      });

      expect(result.current.medicines).toBeNull();
    });

    it('does nothing when removing non-existent medicine', async () => {
      const result = renderWithProvider();

      await act(async () => {
        result.current.setUser(mockUser);
      });

      await waitFor(() => {
        expect(result.current.medicines).toEqual(mockMedicines);
      });

      act(() => {
        result.current.removeMedicine('non_existent');
      });

      expect(result.current.medicines).toEqual(mockMedicines);
    });
  });

  describe('children', () => {
    it('renders children', () => {
      render(
        <UserProvider>
          <span>test-child</span>
        </UserProvider>,
      );

      expect(screen.getByText('test-child')).toBeInTheDocument();
    });
  });

  describe('context value', () => {
    it('provides all context values', () => {
      const result = renderWithProvider();

      expect(result.current).toHaveProperty('user');
      expect(result.current).toHaveProperty('setUser');
      expect(result.current).toHaveProperty('medicines');
      expect(result.current).toHaveProperty('addMedicine');
      expect(result.current).toHaveProperty('removeMedicine');
    });
  });
});
