import type { Entry, StoredEntry } from '@/features/calendar/types/calendar';
import type {
	DescriptionEffectiveness,
	MigraineDescription,
	MigraineEvent,
	ProphylaxisDescription,
} from '@/features/calendar/types/event';
import type { RawEventResponse } from '@/shared/api/types/event';
import { parseDecimalToTime } from '@/shared/utils/date';

const EMPTY_MIDAS: MigraineDescription['midas'] = {
	workMissed: false,
	workImpaired: false,
	choresMissed: false,
	choresImpaired: false,
	socialMissed: false,
};

const toFiniteNumber = (value: unknown): number | null => {
	if (typeof value === 'number' && Number.isFinite(value)) return value;
	if (typeof value === 'string' && value.trim() !== '') {
		const parsed = Number(value);
		if (Number.isFinite(parsed)) return parsed;
	}
	return null;
};

const normalizeDurationRange = (value: unknown): { start: number; end: number } | null => {
	if (!value || typeof value !== 'object') return null;
	const range = value as Record<string, unknown>;
	const start = toFiniteNumber(range.start);
	const end = toFiniteNumber(range.end);
	if (start === null || end === null) return null;
	return { start, end };
};

const normalizeMigraineDescription = (raw: unknown): MigraineDescription | null => {
	if (!raw || typeof raw !== 'object') return null;

	const description = raw as Record<string, unknown>;
	if (!Array.isArray(description.duration)) return null;

	const duration = description.duration.map(normalizeDurationRange);
	if (duration.some((range) => range === null)) return null;

	let effectiveness: DescriptionEffectiveness[] = [];
	if (typeof description.effectiveness === 'string') {
		effectiveness = description.effectiveness.split(',') as DescriptionEffectiveness[];
	} else if (Array.isArray(description.effectiveness)) {
		effectiveness = description.effectiveness as DescriptionEffectiveness[];
	}

	let symptoms: MigraineDescription['symptoms'] = [];
	if (typeof description.symptoms === 'string') {
		symptoms = description.symptoms
			.split(',')
			.map((symptom: string) => symptom.trim()) as MigraineDescription['symptoms'];
	} else if (Array.isArray(description.symptoms)) {
		symptoms = description.symptoms as MigraineDescription['symptoms'];
	}

	const midas =
		description.midas && typeof description.midas === 'object'
			? ({
					...EMPTY_MIDAS,
					...(description.midas as MigraineDescription['midas']),
				} as MigraineDescription['midas'])
			: EMPTY_MIDAS;

	return {
		duration: duration as { start: number; end: number }[],
		intensity: description.intensity as MigraineDescription['intensity'],
		symptoms,
		medicine: typeof description.medicine === 'string' ? description.medicine : '',
		effectiveness,
		midas,
	};
};

export const parseMigraineEventDescription = (
	event: RawEventResponse,
): MigraineDescription | null => {
	try {
		const description =
			typeof event.description === 'string' ? JSON.parse(event.description) : event.description;

		return normalizeMigraineDescription(description);
	} catch {
		return null;
	}
};

export const parseProphylaxisEventDescription = (
	event: RawEventResponse,
): ProphylaxisDescription | null => {
	try {
		return typeof event.description === 'string'
			? JSON.parse(event.description)
			: event.description;
	} catch {
		return null;
	}
};

export const parseMedicineData = (medicine: string, effectiveness: DescriptionEffectiveness[]) => {
	const medicineArray = medicine.split(',').filter((med) => med.trim() !== '');
	const medicineData = medicineArray.reduce<
		Record<string, { taken: number; effectiveness: number }>
	>((acc, med, index) => {
		if (!acc[med]) {
			acc[med] = { taken: 0, effectiveness: 0 };
		}
		acc[med].taken += 1;
		if (effectiveness[index] === 'yes') {
			acc[med].effectiveness += 1;
		}
		return acc;
	}, {});

	return Object.entries(medicineData).map(([med, data]) => ({
		medicine: { abbreviation: med, label: med.toUpperCase() },
		taken: data.taken,
		effectiveness: data.effectiveness,
	}));
};

export const createEntry = (event: MigraineEvent): Entry => ({
	durations: event.description.duration.map(({ start, end }, index: number) => ({
		id: index,
		startTime: parseDecimalToTime(start),
		endTime: parseDecimalToTime(end),
	})),
	intensity: event.description.intensity,
	symptoms: event.description.symptoms,
	medicines: parseMedicineData(event.description.medicine, event.description.effectiveness),
	midas: event.description.midas || {
		workMissed: false,
		workImpaired: false,
		choresMissed: false,
		choresImpaired: false,
		socialMissed: false,
	},
});

export const enrichMedicineLabels = (
	medicines: Entry['medicines'],
	userMedicineOptions: { value: string; label: string }[],
): Entry['medicines'] => {
	return medicines.map((med) => {
		const { abbreviation, label } = med.medicine;

		if (abbreviation.toLowerCase() !== label.toLowerCase()) return med;

		const match = userMedicineOptions.find(
			(option) => option.value.toLowerCase() === abbreviation.toLowerCase(),
		);

		return match ? { ...med, medicine: { abbreviation, label: match.label } } : med;
	});
};

export const isSavedEntryRaw = (obj: unknown): obj is StoredEntry => {
	if (!obj || typeof obj !== 'object') return false;

	const record = obj as Record<string, unknown>;
	if (typeof record.date !== 'string') return false;
	if (!Array.isArray(record.durations)) return false;

	return true;
};
