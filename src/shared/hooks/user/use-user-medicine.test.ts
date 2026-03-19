import * as medicineApi from '@/shared/api/medicine.api';
import * as useUserHook from '@/shared/hooks/user/use-user';
import { useUserMedicines } from '@/shared/hooks/user/use-user-medicines';
import { act, renderHook, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/shared/api/medicine.api');
vi.mock('@/shared/hooks/user/use-user');

const mockUser = { id: 'user-1', name: 'Test' };
const mockMedicines = [
	{ name: 'Test medicine 1', abbreviation: 'tst_med_1' },
	{ name: 'Test medicine 2', abbreviation: 'tst_med_2' },
];

describe('useUserMedicines', () => {
	beforeEach(() => {
		vi.mocked(useUserHook.useUser).mockReturnValue({ user: mockUser } as any);
		vi.mocked(medicineApi.fetchUserMedicinesGet).mockResolvedValue(mockMedicines as any);
	});

	afterEach(() => vi.clearAllMocks());

	it('initializes with empty options', () => {
		vi.mocked(medicineApi.fetchUserMedicinesGet).mockReturnValue(new Promise(() => {}));

		const { result } = renderHook(() => useUserMedicines());

		expect(result.current.userMedicineOptions).toEqual([]);
	});

	it('loads medicines on mount when user is present', async () => {
		const { result } = renderHook(() => useUserMedicines());

		await waitFor(() => expect(result.current.userMedicineOptions).toHaveLength(2));

		expect(result.current.userMedicineOptions).toEqual([
			{ label: 'Test medicine 1', value: 'tst_med_1' },
			{ label: 'Test medicine 2', value: 'tst_med_2' },
		]);
	});

	it('does not fetch when user is null', () => {
		vi.mocked(useUserHook.useUser).mockReturnValue({ user: null } as any);

		renderHook(() => useUserMedicines());

		expect(medicineApi.fetchUserMedicinesGet).not.toHaveBeenCalled();
	});

	it('maps medicine name to label and abbreviation to value', async () => {
		const { result } = renderHook(() => useUserMedicines());

		await waitFor(() => expect(result.current.userMedicineOptions).toHaveLength(2));

		expect(result.current.userMedicineOptions[0]).toEqual({
			label: 'Test medicine 1',
			value: 'tst_med_1',
		});
	});

	it('loadUserMedicines can be called manually', async () => {
		const { result } = renderHook(() => useUserMedicines());

		await waitFor(() => expect(result.current.userMedicineOptions).toHaveLength(2));

		vi.mocked(medicineApi.fetchUserMedicinesGet).mockResolvedValue([
			{ name: 'Test medicine 3', abbreviation: 'tst_med_3' },
		] as any);

		await act(async () => {
			await result.current.loadUserMedicines();
		});

		await waitFor(() =>
			expect(result.current.userMedicineOptions).toEqual([
				{ label: 'Test medicine 3', value: 'tst_med_3' },
			]),
		);
	});
});
