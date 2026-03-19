import * as userApi from '@/shared/api/user.api';
import { useAuthCheck } from '@/shared/auth/use-auth-check';
import { renderHook, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/shared/api/user.api');

const mockUser = { id: 'user-1', name: 'Test' } as any;

describe('useAuthCheck', () => {
	const setUser = vi.fn();

	beforeEach(() => {
		vi.mocked(userApi.fetchUserLogin).mockResolvedValue({ user: mockUser } as any);
		vi.mocked(userApi.fetchUserInformation).mockResolvedValue(mockUser);
		vi.mocked(userApi.fetchUserLogout).mockResolvedValue(undefined as any);
		Object.defineProperty(window, 'location', {
			value: { search: '', href: '' },
			writable: true,
		});
		window.history.replaceState = vi.fn();
	});

	afterEach(() => vi.clearAllMocks());

	describe('code in url', () => {
		it('calls fetchUserLogin when code is in URL', async () => {
			window.location.search = '?code=abc123';

			renderHook(() => useAuthCheck(null, setUser));

			await waitFor(() => expect(userApi.fetchUserLogin).toHaveBeenCalledWith('abc123'));
		});

		it('calls setUser with response user after login', async () => {
			window.location.search = '?code=abc123';

			renderHook(() => useAuthCheck(null, setUser));

			await waitFor(() => expect(setUser).toHaveBeenCalledWith(mockUser));
		});

		it('replaces URL history after login', async () => {
			window.location.search = '?code=abc123';

			renderHook(() => useAuthCheck(null, setUser));

			await waitFor(() => expect(window.history.replaceState).toHaveBeenCalled());
		});

		it('does not call fetchUserLogin when no code in URL', async () => {
			window.location.search = '';

			renderHook(() => useAuthCheck(null, setUser));

			await waitFor(() => expect(userApi.fetchUserInformation).toHaveBeenCalled());
			expect(userApi.fetchUserLogin).not.toHaveBeenCalled();
		});
	});

	describe('fetchUserInformation', () => {
		it('calls fetchUserInformation when authChecked and user is null', async () => {
			window.location.search = '';

			renderHook(() => useAuthCheck(null, setUser));

			await waitFor(() => expect(userApi.fetchUserInformation).toHaveBeenCalled());
		});

		it('does not call fetchUserInformation when user is already set', async () => {
			window.location.search = '';

			renderHook(() => useAuthCheck(mockUser, setUser));

			await waitFor(() => expect(userApi.fetchUserInformation).not.toHaveBeenCalled());
		});

		it('calls setUser with result of fetchUserInformation', async () => {
			window.location.search = '';

			renderHook(() => useAuthCheck(null, setUser));

			await waitFor(() => expect(setUser).toHaveBeenCalledWith(mockUser));
		});
	});

	describe('allowAnonymous', () => {
		it('calls fetchUserLogout when fetchUserInformation fails and allowAnonymous is false', async () => {
			window.location.search = '';
			vi.mocked(userApi.fetchUserInformation).mockRejectedValue(new Error('unauthorized'));

			renderHook(() => useAuthCheck(null, setUser, false));

			await waitFor(() => expect(userApi.fetchUserLogout).toHaveBeenCalled());
		});

		it('does not call fetchUserLogout when fetchUserInformation fails and allowAnonymous is true', async () => {
			window.location.search = '';
			vi.mocked(userApi.fetchUserInformation).mockRejectedValue(new Error('unauthorized'));

			renderHook(() => useAuthCheck(null, setUser, true));

			await waitFor(() => expect(userApi.fetchUserInformation).toHaveBeenCalled());
			expect(userApi.fetchUserLogout).not.toHaveBeenCalled();
		});
	});

	describe('login failure', () => {
		it('does not call setUser when fetchUserLogin throws', async () => {
			window.location.search = '?code=abc123';
			vi.mocked(userApi.fetchUserLogin).mockRejectedValue(new Error('fail'));
			vi.mocked(userApi.fetchUserInformation).mockRejectedValue(new Error('unauthorized'));
			const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

			renderHook(() => useAuthCheck(null, setUser, true));

			await waitFor(() => expect(userApi.fetchUserLogin).toHaveBeenCalled());
			await waitFor(() => expect(userApi.fetchUserInformation).toHaveBeenCalled());
			expect(setUser).not.toHaveBeenCalled();
			consoleSpy.mockRestore();
		});
	});
});
