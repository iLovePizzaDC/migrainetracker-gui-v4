import { api } from '@/shared/api/api';
import type { RawEventResponse } from '@/shared/api/types/event';
import axios from 'axios';

export const fetchProphylaxisEvents = async (signal?: AbortSignal): Promise<RawEventResponse[]> => {
	try {
		const response = await api.get('ProphylaxisEvents', {
			signal,
		});

		return response.data;
	} catch (err) {
		if (axios.isCancel?.(err)) return [];
		if (err instanceof DOMException && err.name === 'AbortError') return [];

		if (axios.isAxiosError(err) && err.response?.status === 404) {
			return [];
		}

		throw new Error('Failed to fetch prophylaxis events');
	}
};
