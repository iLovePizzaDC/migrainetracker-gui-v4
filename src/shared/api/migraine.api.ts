import { api } from '@/shared/api/api';
import type { Filter, RawAreaChartResponse, RawEventResponse } from '@/shared/api/types/migraine';
import type { IntensityType, SymptomType } from '@/shared/constants/event/event-details';
import type { AppendDuration, AppendMedicine, AppendMidas } from '@/shared/types/calendar/calendar';
import type { CardType, TimeFrameUnit } from '@/shared/types/cards/card';
import { parseTimeToDecimal } from '@/shared/utils/date/date';
import { formatEffectiveness, formatMedicine } from '@/shared/utils/formatter/event-parser';
import axios from 'axios';

const ENDPOINT_BASE_URL = import.meta.env.VITE_ENDPOINT_BASE_URL;
const API_URL_SUFFIX = import.meta.env.VITE_API_URL_SUFFIX;

// TODO refactor
export const fetchMigraineEvents = async (
	start: string,
	end: string,
	filter?: Filter,
	signal?: AbortSignal,
): Promise<RawEventResponse[] | undefined> => {
	const filterObject: { [key: string]: string } = {};

	if (filter?.duration !== undefined && filter.duration !== 'all')
		filterObject.duration = filter.duration;

	if (filter?.intensity !== undefined && filter.intensity !== 'all')
		filterObject.intensity = filter.intensity;

	if (filter?.symptoms !== undefined && filter.symptoms !== 'all')
		filterObject.symptoms = filter.symptoms;

	if (filter?.medicines !== undefined && filter.medicines !== 'all')
		filterObject.medicines = filter.medicines;

	if (filter?.effectiveness !== undefined && filter.effectiveness !== 'all')
		filterObject.effectiveness = filter.effectiveness;

	const filterString = encodeURIComponent(JSON.stringify(filterObject));
	const url = `${ENDPOINT_BASE_URL}${API_URL_SUFFIX}MigraineEvents?dateMin=${start}&dateMax=${end}&filter=${filterString}`;

	try {
		const response = await api.get(url, { signal });
		return response.data;
	} catch (err) {
		if (axios.isCancel?.(err)) return;
		if (err instanceof DOMException && err.name === 'AbortError') return;

		throw new Error('Failed to fetch migraine events');
	}
};

export const fetchMigraineAmount = async (
	start: string,
	end: string,
	filter?: Filter,
): Promise<number> => {
	const filterObject: { [key: string]: string } = {};

	if (filter) {
		Object.entries(filter).forEach(([key, value]) => {
			if (value !== undefined) {
				filterObject[key] = value;
			}
		});
	}

	const filterString = encodeURIComponent(JSON.stringify(filterObject));
	const url: string = `${ENDPOINT_BASE_URL}${API_URL_SUFFIX}MigraineAmount?dateMin=${start}&dateMax=${end}&filter=${filterString}`;

	try {
		const response = await api.get(url);

		return response.data;
	} catch {
		throw new Error('Failed to fetch migraine amount');
	}
};

export const fetchDurationAmount = async (
	start: string,
	end: string,
	filter?: Filter,
): Promise<number> => {
	const filterObject: { [key: string]: string } = {};

	if (filter?.duration !== undefined && filter.duration !== 'all')
		filterObject.duration = filter.duration;
	if (filter?.intensity !== undefined && filter.intensity !== 'all')
		filterObject.intensity = filter.intensity;
	if (filter?.symptoms !== undefined && filter.symptoms !== 'all')
		filterObject.symptoms = filter.symptoms;
	if (filter?.medicines !== undefined && filter.medicines !== 'all')
		filterObject.medicines = filter.medicines;
	if (filter?.effectiveness !== undefined && filter.effectiveness !== 'all')
		filterObject.effectiveness = filter.effectiveness;

	const filterString = encodeURIComponent(JSON.stringify(filterObject));
	const url: string = `${ENDPOINT_BASE_URL}${API_URL_SUFFIX}DurationAmount?dateMin=${start}&dateMax=${end}&filter=${filterString}`;

	try {
		const response = await api.get(url);

		return response.data;
	} catch {
		throw new Error('Failed to fetch duration amount');
	}
};

export const fetchMedicineAmount = async (
	start: string,
	end: string,
	filter?: Filter,
): Promise<number> => {
	const filterObject: { [key: string]: string } = {};

	if (filter?.duration !== undefined && filter.duration !== 'all')
		filterObject.duration = filter.duration;
	if (filter?.intensity !== undefined && filter.intensity !== 'all')
		filterObject.intensity = filter.intensity;
	if (filter?.symptoms !== undefined && filter.symptoms !== 'all')
		filterObject.symptoms = filter.symptoms;
	if (filter?.medicines !== undefined && filter.medicines !== 'all')
		filterObject.medicines = filter.medicines;
	if (filter?.effectiveness !== undefined && filter.effectiveness !== 'all')
		filterObject.effectiveness = filter.effectiveness;

	const filterString = encodeURIComponent(JSON.stringify(filterObject));
	const url: string = `${ENDPOINT_BASE_URL}${API_URL_SUFFIX}MedicineAmount?dateMin=${start}&dateMax=${end}&filter=${filterString}`;

	try {
		const response = await api.get(url);

		return response.data;
	} catch {
		throw new Error('Failed to fetch medicine amount');
	}
};

export const fetchAreaChart = async (
	type: CardType,
	end: string,
	timeFrameCount: number,
	timeFrameUnit: TimeFrameUnit,
	filter?: Filter,
): Promise<RawAreaChartResponse> => {
	const filterObject: { [key: string]: string } = {};

	if (filter?.duration !== undefined && filter.duration !== 'all')
		filterObject.duration = filter.duration;
	if (filter?.intensity !== undefined && filter.intensity !== 'all')
		filterObject.intensity = filter.intensity;
	if (filter?.symptoms !== undefined && filter.symptoms !== 'all')
		filterObject.symptoms = filter.symptoms;
	if (filter?.medicines !== undefined && filter.medicines !== 'all')
		filterObject.medicines = filter.medicines;
	if (filter?.effectiveness !== undefined && filter.effectiveness !== 'all')
		filterObject.effectiveness = filter.effectiveness;

	const filterString = encodeURIComponent(JSON.stringify(filterObject));
	const url: string = `${ENDPOINT_BASE_URL}${API_URL_SUFFIX}AreaChart?type=${type}&end=${end}&timeFrameCount=${timeFrameCount}&timeFrameUnit=${timeFrameUnit}&filter=${filterString}`;

	try {
		const response = await api.get(url);

		return response.data;
	} catch {
		throw new Error('Failed to fetch AreaChart');
	}
};

export const fetchNewEntry = async (
	date: string,
	durations: AppendDuration[],
	intensity: IntensityType,
	symptoms: SymptomType[],
	medicines: AppendMedicine[],
	midas: AppendMidas,
): Promise<RawEventResponse> => {
	const medicineString: string = formatMedicine(medicines);
	const effectivenessString: string = formatEffectiveness(medicines);

	const formattedDurations = durations.map((duration) => ({
		start: parseTimeToDecimal(duration.startTime).toString(),
		end: parseTimeToDecimal(duration.endTime).toString(),
	}));

	const newEntry = {
		duration: formattedDurations,
		intensity: intensity,
		symptoms: symptoms,
		medicine: medicineString,
		effectiveness: effectivenessString,
		midas: midas,
	};

	const url: string = `${ENDPOINT_BASE_URL}${API_URL_SUFFIX}MigraineEvent?date=${date}`;

	try {
		const response = await api.post(url, newEntry);

		return response.data;
	} catch {
		throw new Error('Failed to fetch new entry');
	}
};

export const fetchMidasScore = async (end: string) => {
	const url: string = `${ENDPOINT_BASE_URL}${API_URL_SUFFIX}MidasScore?end=${end}`;

	try {
		const response = await api.get(url);

		return response.data;
	} catch {
		throw new Error('Failed to fetch medicine amount');
	}
};
