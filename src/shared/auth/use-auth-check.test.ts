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

		Object.defineProperty(window, 'location', {
			value: {
				search: '',
				href: 'https://example.com/home?code=abc123',
				origin: 'https://example.com',
			},
			writable: true,
		});
		window.history.replaceState = vi.fn();
	});

	afterEach(() => vi.clearAllMocks());

	describe('code in URL', () => {
		it('calls fetchUserLogin when code is in URL', async () => {
			window.location.search = '?code=abc123';

			renderHook(() => useAuthCheck(setUser));

			await waitFor(() => expect(userApi.fetchUserLogin).toHaveBeenCalledWith('abc123'));
		});

		it('calls setUser with response user after login', async () => {
			window.location.search = '?code=abc123';

			renderHook(() => useAuthCheck(setUser));

			await waitFor(() => expect(setUser).toHaveBeenCalledWith(mockUser));
		});

		it('replaces URL history after login with absolute URL', async () => {
			window.location.search = '?code=abc123';
			window.location.href = 'https://example.com/home?code=abc123';

			renderHook(() => useAuthCheck(setUser));

			await waitFor(() =>
				expect(window.history.replaceState).toHaveBeenCalledWith(
					{},
					'',
					'https://example.com/home',
				),
			);
		});
	});

	describe('no code in URL', () => {
		it('calls fetchUserInformation when no code in URL', async () => {
			window.location.search = '';

			renderHook(() => useAuthCheck(setUser));

			await waitFor(() => expect(userApi.fetchUserInformation).toHaveBeenCalled());
		});

		it('calls setUser with result of fetchUserInformation', async () => {
			window.location.search = '';

			renderHook(() => useAuthCheck(setUser));

			await waitFor(() => expect(setUser).toHaveBeenCalledWith(mockUser));
		});
	});

	describe('login failure', () => {
		it('sets user to null if fetchUserLogin fails', async () => {
			window.location.search = '?code=abc123';
			vi.mocked(userApi.fetchUserLogin).mockRejectedValue(new Error('fail'));
			vi.mocked(userApi.fetchUserInformation).mockRejectedValue(new Error('unauthorized'));

			renderHook(() => useAuthCheck(setUser));

			await waitFor(() => expect(setUser).toHaveBeenCalledWith(null));
		});
	});
});
