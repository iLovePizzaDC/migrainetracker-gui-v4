import { CardSetupsContext } from '@/features/home/context/card-setups-context';
import { useCardSetups } from '@/features/home/hooks/use-card-setups';
import { renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

describe('useCardSetups', () => {
	it('returns context when used inside provider', () => {
		const fakeContext = {
			cardSetups: [],
			setCardSetups: () => {},
			removeSetupByIndex: () => {},
			updateSetupByIndex: () => {},
			appendSetup: () => {},
		};

		const { result } = renderHook(() => useCardSetups(), {
			wrapper: ({ children }) => (
				<CardSetupsContext.Provider value={fakeContext}>{children}</CardSetupsContext.Provider>
			),
		});

		expect(result.current).toBe(fakeContext);
	});

	it('throws error when used outside provider', () => {
		expect(() => renderHook(() => useCardSetups())).toThrowError(
			'useCardSetups must be used within a CardSetupsProvider',
		);
	});
});
