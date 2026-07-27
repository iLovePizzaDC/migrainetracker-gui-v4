import { useCalendar } from '@/features/calendar/hooks/use-calendar';
import { fetchNewEntry } from '@/shared/api/migraine.api';
import { formatDateToUs } from '@/shared/utils/date/date';
import { FEEDBACK_TYPES, type FeedbackType } from '@/shared/constants/button/feedback';
import type { Entry } from '@/features/calendar/types/calendar';
import { useEffect, useState } from 'react';
import { getInitialFormState } from '@/features/calendar/utils/migraine-panel';

export function useMigrainePanel(
	date: Date,
	onClose: () => void,
	disabled: boolean,
	prefilled?: Entry | null,
) {
	const { refetchEvents } = useCalendar();

	const [form, setForm] = useState<Entry>(() => getInitialFormState(prefilled));

	const [areInputsDisabled, setAreInputsDisabled] = useState(disabled);
	const [cacheFeedback, setCacheFeedback] = useState<FeedbackType>(FEEDBACK_TYPES.NULL);
	const [saveFeedback, setSaveFeedback] = useState<FeedbackType>(FEEDBACK_TYPES.NULL);
	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		setAreInputsDisabled(disabled);
		setCacheFeedback(FEEDBACK_TYPES.NULL);
		setSaveFeedback(FEEDBACK_TYPES.NULL);
		setForm(getInitialFormState(prefilled));
	}, [date, disabled, prefilled]);

	const showMedicine = !prefilled || !areInputsDisabled || form.medicines.length > 0;

	const updateForm = <K extends keyof Entry>(key: K, value: Entry[K]) => {
		setForm((prev) => ({
			...prev,
			[key]: value,
		}));
	};

	const submitNewEntry = async () => {
		try {
			setIsLoading(true);

			await fetchNewEntry(
				formatDateToUs(date),
				form.durations,
				form.intensity,
				form.symptoms,
				form.medicines,
				form.midas,
			);

			setSaveFeedback(FEEDBACK_TYPES.SUCCESS);

			await refetchEvents();

			onClose();
		} catch (err) {
			console.error(err);
			setSaveFeedback(FEEDBACK_TYPES.ERROR);
		} finally {
			setIsLoading(false);
		}
	};

	const saveNewEntry = () => {
		try {
			localStorage.setItem(
				'MT_NE',
				JSON.stringify({
					date,
					...form,
				}),
			);

			setCacheFeedback(FEEDBACK_TYPES.SUCCESS);

			setTimeout(() => onClose(), 500);
		} catch (err) {
			console.error(err);
			setCacheFeedback(FEEDBACK_TYPES.ERROR);
		}
	};

	return {
		areInputsDisabled,
		setAreInputsDisabled,
		cacheFeedback,
		saveFeedback,
		isLoading,
		form,
		updateForm,
		showMedicine,
		submitNewEntry,
		saveNewEntry,
	} as const;
}
