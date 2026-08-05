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

export function getNextRecurrenceDate(
	startDate: Date,
	recurrence: string[] | null | undefined,
	now: Date = new Date(),
): Date | null {
	if (!recurrence?.length) {
		return startDate <= now ? startDate : null;
	}

	try {
		const rule = RRule.fromString(recurrence[0].replace(/^RRULE:/, ''));

		const ruleWithStartDate = new RRule({
			...rule.origOptions,
			dtstart: startDate,
		});

		const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
		const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

		const occurrences = ruleWithStartDate.between(monthStart, monthEnd, true);

		return occurrences[0] ?? null;
	} catch {
		return startDate;
	}
}
