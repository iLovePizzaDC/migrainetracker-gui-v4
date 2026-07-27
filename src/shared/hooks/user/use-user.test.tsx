import { UserContext } from '@/shared/context/user/user-context';
import { useUser } from '@/shared/hooks/user/use-user';
import { renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

describe('useUser', () => {
	it('returns context when used inside provider', () => {
		const fakeContext = { user: { id: 'user-1' }, setUser: () => {} } as any;

		const { result } = renderHook(() => useUser(), {
			wrapper: ({ children }) => (
				<UserContext.Provider value={fakeContext}>{children}</UserContext.Provider>
			),
		});

		expect(result.current).toBe(fakeContext);
	});

	it('throws error when used outside provider', () => {
		expect(() => renderHook(() => useUser())).toThrowError(
			'useUser must be used within a UserProvider',
		);
	});
});
