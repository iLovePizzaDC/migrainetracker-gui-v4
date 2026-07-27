import { describe, it, vi } from 'vitest';

vi.mock('@/features/calendar/hooks/use-calendar', () => ({
	useCalendar: vi.fn(),
}));
vi.mock('@/shared/api/migraine.api');
vi.mock('@/shared/utils/date/date', () => ({
	formatDateToUs: vi.fn(),
}));
vi.mock('@/features/calendar/utils/migraine-panel', () => ({
	getInitialFormState: vi.fn(),
}));

describe('useMigrainePanel', () => {
	it('', () => {});
});
