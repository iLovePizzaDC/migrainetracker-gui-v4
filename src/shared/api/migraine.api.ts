import axios from 'axios';
import type { AppendDuration, AppendMedicine, AppendMidas, Filter } from '../types';
import type { SVG } from '../constants/cards/svg';
import type { TimeFrameUnit } from '../constants/cards/time-frame';
import { formatEffectiveness, formatMedicine } from '../utils/formatter/event-parser';
import { parseTimeToDecimal } from '../utils/date/date';

const BASE_URL = import.meta.env.VITE_BASE_URL;
const API_URL_SUFFIX = import.meta.env.VITE_API_URL_SUFFIX;

export const fetchMigraineEvents = async (
    start: string,
    end: string,
    filter?: Filter
) => {
    const filterObject: { [key: string]: string } = {
        startDate: start,
        endDate: end,
    };

    if (filter?.duration !== undefined && filter.duration !== 'all') filterObject.duration = filter.duration;
    if (filter?.intensity !== undefined && filter.intensity !== 'all') filterObject.intensity = filter.intensity;
    if (filter?.symptoms !== undefined && filter.symptoms !== 'all') filterObject.symptoms = filter.symptoms;
    if (filter?.medicines !== undefined && filter.medicines !== 'all') filterObject.medicines = filter.medicines;

    const filterString = encodeURIComponent(JSON.stringify(filterObject));
    const token: string = localStorage.getItem('token') || '';
    const url: string = `${BASE_URL}${API_URL_SUFFIX}/MigraineEvents?accessToken=${token}&filter=${filterString}`;

    try {
        const response = await axios.get(url);

        return response.data;
    } catch {
        throw new Error('Failed to fetch migraine events');
    }
};

export const fetchMigraineAmount = async (
    start: string,
    end: string,
    filter?: Filter
) => {
    const filterObject: { [key: string]: string } = {
        startDate: start,
        endDate: end,
    };

    if (filter) {
        Object.entries(filter).forEach(([key, value]) => {
            if (value !== undefined) {
                filterObject[key] = value;
            }
        });
    }

    const filterString = encodeURIComponent(JSON.stringify(filterObject));
    const token: string = localStorage.getItem('token') || '';
    const url: string = `${BASE_URL}${API_URL_SUFFIX}/MigraineAmount?accessToken=${token}&filter=${filterString}`;

    try {
        const response = await axios.get(url);

        return response.data;
    } catch {
        throw new Error('Failed to fetch migraine amount');
    }
};

export const fetchDurationAmount = async (
    start: string,
    end: string,
    filter?: Filter
) => {
    const filterObject: { [key: string]: string } = {
        startDate: start,
        endDate: end,
    };

    if (filter?.duration !== undefined && filter.duration !== 'all') filterObject.duration = filter.duration;
    if (filter?.intensity !== undefined && filter.intensity !== 'all') filterObject.intensity = filter.intensity;
    if (filter?.symptoms !== undefined && filter.symptoms !== 'all') filterObject.symptoms = filter.symptoms;
    if (filter?.medicines !== undefined && filter.medicines !== 'all') filterObject.medicines = filter.medicines;

    const filterString = encodeURIComponent(JSON.stringify(filterObject));
    const token: string = localStorage.getItem('token') || '';
    const url: string = `${BASE_URL}${API_URL_SUFFIX}/DurationAmount?accessToken=${token}&filter=${filterString}`;

    try {
        const response = await axios.get(url);

        return response.data;
    } catch {
        throw new Error('Failed to fetch duration amount');
    }
};

export const fetchMedicineAmount = async (
    start: string,
    end: string,
    filter?: Filter
) => {
    const filterObject: { [key: string]: string } = {
        startDate: start,
        endDate: end,
    };

    if (filter?.duration !== undefined && filter.duration !== 'all') filterObject.duration = filter.duration;
    if (filter?.intensity !== undefined && filter.intensity !== 'all') filterObject.intensity = filter.intensity;
    if (filter?.symptoms !== undefined && filter.symptoms !== 'all') filterObject.symptoms = filter.symptoms;
    if (filter?.medicines !== undefined && filter.medicines !== 'all') filterObject.medicines = filter.medicines;

    const filterString = encodeURIComponent(JSON.stringify(filterObject));
    const token: string = localStorage.getItem('token') || '';
    const url: string = `${BASE_URL}${API_URL_SUFFIX}/MedicineAmount?accessToken=${token}&filter=${filterString}`;

    try {
        const response = await axios.get(url);

        return response.data;
    } catch {
        throw new Error('Failed to fetch medicine amount');
    }
};

export const fetchAreaChart = async (
    type: SVG,
    end: string,
    timeFrameCount: number,
    timeFrameUnit: TimeFrameUnit,
    filter?: Filter
) => {
    const filterObject: { [key: string]: string } = {};

    if (filter?.duration !== undefined && filter.duration !== 'all') filterObject.duration = filter.duration;
    if (filter?.intensity !== undefined && filter.intensity !== 'all') filterObject.intensity = filter.intensity;
    if (filter?.symptoms !== undefined && filter.symptoms !== 'all') filterObject.symptoms = filter.symptoms;
    if (filter?.medicines !== undefined && filter.medicines !== 'all') filterObject.medicines = filter.medicines;

    const filterString = encodeURIComponent(JSON.stringify(filterObject));
    const token: string = localStorage.getItem('token') || '';
    const url: string = `${BASE_URL}${API_URL_SUFFIX}/AreaChart?accessToken=${token}&type=${type}&end=${end}&timeFrameCount=${timeFrameCount}&timeFrameUnit=${timeFrameUnit}&filter=${filterString}`;

    try {
        const response = await axios.get(url);

        return response.data;
    } catch {
        throw new Error('Failed to fetch AreaChart');
    }
};

// TODO use axios
export const fetchNewEntry = async (date: string, durations: AppendDuration[], intensity: string, symptoms: string[], medicines: AppendMedicine[], midas: AppendMidas) => {
    const token: string = localStorage.getItem('token') || '';

    const medicineString: string = formatMedicine(medicines);
    const effectivenessString: string = formatEffectiveness(medicines);

    const formattedDurations = durations.map(duration => ({
        start: parseTimeToDecimal(duration.startTime).toString(),
        end: parseTimeToDecimal(duration.endTime).toString()
    }));

    const newEntry = {
        duration: formattedDurations,
        intensity: intensity,
        symptoms: symptoms,
        medicine: medicineString,
        effectiveness: effectivenessString,
        midas: midas
    };

    const url: string = `${BASE_URL}${API_URL_SUFFIX}/MigraineEvent?date=${date}&accessToken=${token}`;

    const response: Response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(newEntry),
    });

    if (!response.ok) {
        throw new Error('Failed to create new migraine event');
    }

    return response;
};

export const fetchMidasScore = async () => {
    const token: string = localStorage.getItem('token') || '';
    const url: string = `${BASE_URL}${API_URL_SUFFIX}/MidasScore?accessToken=${token}`;

    try {
        const response = await axios.get(url);

        return response.data;
    } catch {
        throw new Error('Failed to fetch medicine amount');
    }
};
