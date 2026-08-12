import { RRule } from 'rrule';

export function formatRecurrence(rrules: string[] | null): string | null {
	if (!rrules?.length) return null;

	const rrule = rrules[0].replace(/^RRULE:/, '');

	if (!/\bFREQ=/.test(rrule)) {
		return null;
	}

	try {
		return RRule.fromString(rrule).toText();
	} catch {
		return null;
	}
}

function isSameMonth(a: Date, b: Date): boolean {
	return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth();
}

export function getNextRecurrenceDate(
	startDate: Date,
	recurrence: string[] | null | undefined,
	viewDate: Date = new Date(),
): Date | null {
	if (!recurrence?.length) {
		return isSameMonth(startDate, viewDate) ? startDate : null;
	}

	try {
		const rule = RRule.fromString(recurrence[0].replace(/^RRULE:/, ''));

		const ruleWithStartDate = new RRule({
			...rule.origOptions,
			dtstart: startDate,
		});

		const monthStart = new Date(viewDate.getFullYear(), viewDate.getMonth(), 1);
		const monthEnd = new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 0, 23, 59, 59);

		const occurrences = ruleWithStartDate.between(monthStart, monthEnd, true);

		return occurrences[0] ?? null;
	} catch {
		return isSameMonth(startDate, viewDate) ? startDate : null;
	}
}
