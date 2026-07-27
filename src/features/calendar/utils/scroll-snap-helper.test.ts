import { clamp, normalizeTime } from '@/features/calendar/utils/scroll-snap-helper';
import { describe, expect, it } from 'vitest';

describe('clamp', () => {
	it('returns the value when within range', () => {
		expect(clamp(5, 0, 10)).toBe(5);
	});

	it('returns min when value is below range', () => {
		expect(clamp(-1, 0, 10)).toBe(0);
	});

	it('returns max when value is above range', () => {
		expect(clamp(11, 0, 10)).toBe(10);
	});

	it('returns min when value equals min', () => {
		expect(clamp(0, 0, 10)).toBe(0);
	});

	it('returns max when value equals max', () => {
		expect(clamp(10, 0, 10)).toBe(10);
	});
});

describe('normalizeTime', () => {
	describe('with colon', () => {
		it('formats a valid time string correctly', () => {
			expect(normalizeTime('9:5')).toBe('09:05');
		});

		it('pads hours and minutes with leading zeros', () => {
			expect(normalizeTime('8:3')).toBe('08:03');
		});

		it('clamps hours above 23 to 23', () => {
			expect(normalizeTime('25:00')).toBe('23:00');
		});

		it('clamps minutes above 59 to 59', () => {
			expect(normalizeTime('10:99')).toBe('10:59');
		});

		it('handles 00:00 correctly', () => {
			expect(normalizeTime('0:0')).toBe('00:00');
		});

		it('handles 23:59 correctly', () => {
			expect(normalizeTime('23:59')).toBe('23:59');
		});

		it('strips non-numeric non-colon characters', () => {
			expect(normalizeTime('1a2:3b4')).toBe('12:34');
		});

		it('treats missing minutes as 0 when colon is present', () => {
			expect(normalizeTime('10:')).toBe('10:00');
		});

		it('treats missing hours as 0 when colon is present', () => {
			expect(normalizeTime(':30')).toBe('00:30');
		});
	});

	describe('without colon', () => {
		it('returns cleaned string as-is when no colon is present', () => {
			expect(normalizeTime('1234')).toBe('1234');
		});

		it('strips non-numeric characters when no colon is present', () => {
			expect(normalizeTime('12ab')).toBe('12');
		});

		it('returns empty string for fully non-numeric input without colon', () => {
			expect(normalizeTime('abc')).toBe('');
		});
	});
});
