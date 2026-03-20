import { UserContext } from '@/shared/context/user/user-context';
import { UserProvider } from '@/shared/hooks/user/user-provider';
import { act, render, renderHook, screen } from '@testing-library/react';
import { useContext } from 'react';
import { describe, expect, it } from 'vitest';

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

	it('renders children', () => {
		render(
			<UserProvider>
				<span>test-child</span>
			</UserProvider>,
		);

		expect(screen.getByText('test-child')).toBeInTheDocument();
	});
});
