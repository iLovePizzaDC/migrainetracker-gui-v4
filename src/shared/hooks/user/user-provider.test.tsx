import { fetchUserMedicinesGet } from '@/shared/api/medicine.api';
import { UserContext } from '@/shared/context/user/user-context';
import { UserProvider } from '@/shared/hooks/user/user-provider';
import { act, render, renderHook, screen, waitFor } from '@testing-library/react';
import { useContext } from 'react';
import { describe, expect, it, vi } from 'vitest';

vi.mock('@/shared/api/medicine.api', () => ({
	fetchUserMedicinesGet: vi.fn(),
}));

function renderWithProvider() {
	const { result } = renderHook(() => useContext(UserContext), {
		wrapper: ({ children }) => <UserProvider>{children}</UserProvider>,
	});
	return result as { current: NonNullable<typeof result.current> };
}

describe('UserProvider', () => {
	it('provides user as null initially', () => {
		const result = renderWithProvider();

		expect(result.current.user).toBeNull();
	});

	it('provides medicines as null initially', () => {
		const result = renderWithProvider();

		expect(result.current.medicines).toBeNull();
	});

	it('provides setUser function', () => {
		const result = renderWithProvider();

		expect(typeof result.current.setUser).toBe('function');
	});

	it('updates user when setUser is called', () => {
		const result = renderWithProvider();
		const mockUser = { id: 'user-1', name: 'Test' } as any;

		act(() => {
			result.current.setUser(mockUser);
		});

		expect(result.current.user).toEqual(mockUser);
	});

	it('loads medicines when user is set', async () => {
		const mockMedicines = [
			{ id: 'medicine-1', name: 'Medicine 1' },
			{ id: 'medicine-2', name: 'Medicine 2' },
		] as any;

		vi.mocked(fetchUserMedicinesGet).mockResolvedValue(mockMedicines);

		const result = renderWithProvider();

		act(() => {
			result.current.setUser({ id: 'user-1' } as any);
		});

		await waitFor(() => {
			expect(result.current.medicines).toEqual(mockMedicines);
		});

		expect(fetchUserMedicinesGet).toHaveBeenCalled();
	});

	it('renders children', () => {
		render(
			<UserProvider>
				<span>test-child</span>
			</UserProvider>,
		);

		expect(screen.getByText('test-child')).toBeInTheDocument();
	});
});
