import { ANY_FILTER_TYPE, type AnyInputFilterType } from '@/shared/constants/event/event-details';

function isObject(value: unknown): value is Record<string, unknown> {
	return typeof value === 'object' && value !== null;
}

function isAnyMedicine(value: unknown): value is AnyInputFilterType {
	return isObject(value) && 'abbreviation' in value && value.abbreviation === ANY_FILTER_TYPE.ANY;
}

export function replaceAnyWithNull<T>(input: T): T {
	if (input === ANY_FILTER_TYPE.ANY) {
		return null as unknown as T;
	}

	if (Array.isArray(input)) {
		return input
			.map((v) => replaceAnyWithNull(v))
			.filter((v) => v !== ANY_FILTER_TYPE.ANY) as unknown as T;
	}

	if (isAnyMedicine(input)) {
		return null as unknown as T;
	}

	if (isObject(input)) {
		const result: Record<string, unknown> = {};

		for (const [key, value] of Object.entries(input)) {
			result[key] = replaceAnyWithNull(value);
		}

		return result as T;
	}

	return input;
}
