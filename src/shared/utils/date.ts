export function parseTimeToDecimal(time: string): number {
	const [hours, minutes] = finalizeTime(time).split(':').map(Number);
	const decimalTime = hours + minutes / 60;

	return parseFloat(decimalTime.toFixed(2));
}

export const parseDecimalToTime = (time: number) => {
	const hours = Math.floor(time);
	const minutes = Math.round(((time % 1) * 100 * 60) / 100);
	return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
};

const clampTimePart = (n: number, min: number, max: number) => Math.max(min, Math.min(max, n));

export const finalizeTime = (input: string): string => {
	const cleaned = input.replace(/[^\d:]/g, '');

	if (!cleaned) return '00:00';

	let hours: number;
	let minutes: number;

	if (cleaned.includes(':')) {
		const [h = '0', m = '0'] = cleaned.split(':');
		hours = clampTimePart(Number(h || 0), 0, 23);
		minutes = clampTimePart(Number(m || 0), 0, 59);
	} else if (cleaned.length <= 2) {
		hours = clampTimePart(Number(cleaned), 0, 23);
		minutes = 0;
	} else if (cleaned.length === 3) {
		hours = clampTimePart(Number(cleaned[0]), 0, 23);
		minutes = clampTimePart(Number(cleaned.slice(1)), 0, 59);
	} else {
		hours = clampTimePart(Number(cleaned.slice(0, 2)), 0, 23);
		minutes = clampTimePart(Number(cleaned.slice(2, 4)), 0, 59);
	}

	return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
};

export const formatDateToUs = (date: Date): string => {
	const year = date.getFullYear();
	const month = String(date.getMonth() + 1).padStart(2, '0');
	const day = String(date.getDate()).padStart(2, '0');
	return `${year}-${month}-${day}`;
};

export const parseDateOnlyLocal = (dateStr: string): Date => {
	const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dateStr);
	if (!match) return new Date(dateStr);

	const [, year, month, day] = match;
	return new Date(Number(year), Number(month) - 1, Number(day));
};

const adjustDate = (date: Date, adjustment: number, isMonth: boolean = false): Date => {
	const newDate = new Date(date);
	if (isMonth) {
		newDate.setMonth(newDate.getMonth() + adjustment);
	} else {
		newDate.setDate(newDate.getDate() + adjustment);
	}
	return newDate;
};

export const getDateAfterDays = (date: Date, days: number): Date => adjustDate(date, +days);

export const getDateBeforeDays = (date: Date, days: number): Date => adjustDate(date, -days);

export const getDateBeforeMonths = (date: Date, months: number): Date =>
	adjustDate(date, -months, true);

export function getDayDifference(start: Date, end: Date): number {
	const msPerDay = 1000 * 60 * 60 * 24;

	const startMidnight = new Date(start.getFullYear(), start.getMonth(), start.getDate());
	const endMidnight = new Date(end.getFullYear(), end.getMonth(), end.getDate());

	const diffMs = endMidnight.getTime() - startMidnight.getTime();

	return Math.floor(diffMs / msPerDay) + 1;
}

export function normalizeDate(date: Date) {
	const normalized = new Date(date);
	normalized.setHours(0, 0, 0, 0);
	return normalized;
}

export const getStartOfMonth = (date: Date): Date =>
	new Date(date.getFullYear(), date.getMonth(), 1, 0, 0, 0, 0);

export const getEndOfMonth = (date: Date): Date =>
	new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59, 999);
