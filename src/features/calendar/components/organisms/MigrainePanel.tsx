import Durations from '@/features/calendar/components/molecules/Durations';
import Intensity from '@/features/calendar/components/molecules/Intensity';
import Medicine from '@/features/calendar/components/molecules/Medicine';
import Midas from '@/features/calendar/components/molecules/Midas';
import Symptoms from '@/features/calendar/components/molecules/Symptoms';
import { useCalendar } from '@/features/calendar/hooks/use-calendar';
import type { Entry } from '@/features/calendar/types/calendar';
import { fetchNewEntry } from '@/shared/api/migraine.api';
import SubmitButton from '@/shared/components/atoms/SubmitButton';
import { FEEDBACK_TYPES, type FeedbackType } from '@/shared/constants/button/feedback';
import {
	INTENSITY_TYPES,
	SYMPTOM_TYPES,
	type IntensityType,
	type SymptomType,
} from '@/shared/constants/event/event-details';
import { BUTTON_TYPES } from '@/shared/constants/input/button';
import type { AppendDuration, AppendMedicine, AppendMidas } from '@/shared/types/calendar/calendar';
import { formatDateToUs } from '@/shared/utils/date/date';
import { PencilIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { useEffect, useState } from 'react';

interface IMigrainePanel {
	date: Date;
	onClose: () => void;
	isOpen: boolean;
	prefilled?: Entry | null;
	disabled?: boolean;
}

function MigrainePanel({
	date,
	onClose,
	isOpen,
	prefilled = null,
	disabled = false,
}: IMigrainePanel) {
	const { refetchEvents } = useCalendar();

	const [areInputsDisabled, setAreInputsDisabled] = useState(disabled);
	const [cacheFeedback, setCacheFeedback] = useState<FeedbackType>(FEEDBACK_TYPES.NULL);
	const [saveFeedback, setSaveFeedback] = useState<FeedbackType>(FEEDBACK_TYPES.NULL);
	const [isLoading, setIsLoading] = useState(false);

	const [durations, setDurations] = useState<AppendDuration[]>(
		prefilled ? prefilled.durations : [{ id: 0, startTime: '12:00', endTime: '13:00' }],
	);

	const [intensity, setIntensity] = useState<IntensityType>(
		prefilled ? prefilled.intensity : INTENSITY_TYPES.MEDIUM,
	);

	const [symptoms, setSymptoms] = useState<SymptomType[]>(
		prefilled ? prefilled.symptoms : [SYMPTOM_TYPES.NOISE, SYMPTOM_TYPES.LIGHT],
	);

	const [medicines, setMedicines] = useState<AppendMedicine[]>(
		prefilled ? prefilled.medicines : [],
	);

	const [midas, setMidas] = useState<AppendMidas>(
		prefilled
			? prefilled.midas
			: {
					workMissed: false,
					workImpaired: false,
					choresMissed: false,
					choresImpaired: false,
					socialMissed: false,
				},
	);

	const showMedicine = !prefilled || !areInputsDisabled || medicines.length > 0;

	const submitNewEntry = async () => {
		try {
			setIsLoading(true);

			await fetchNewEntry(formatDateToUs(date), durations, intensity, symptoms, medicines, midas);

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
				JSON.stringify({ date, durations, intensity, symptoms, medicines, midas }),
			);
			setCacheFeedback(FEEDBACK_TYPES.SUCCESS);
			setTimeout(() => onClose(), 500);
		} catch (err) {
			console.error(err);
			setCacheFeedback(FEEDBACK_TYPES.ERROR);
		}
	};

	useEffect(() => setAreInputsDisabled(disabled), [date, disabled]);

	useEffect(() => {
		setAreInputsDisabled(disabled);
		setSaveFeedback(FEEDBACK_TYPES.NULL);
		setCacheFeedback(FEEDBACK_TYPES.NULL);

		setDurations(
			prefilled ? prefilled.durations : [{ id: 0, startTime: '12:00', endTime: '13:00' }],
		);
		setIntensity(prefilled ? prefilled.intensity : INTENSITY_TYPES.MEDIUM);
		setSymptoms(prefilled ? prefilled.symptoms : [SYMPTOM_TYPES.NOISE, SYMPTOM_TYPES.LIGHT]);
		setMedicines(prefilled ? prefilled.medicines : []);
		setMidas(
			prefilled
				? prefilled.midas
				: {
						workMissed: false,
						workImpaired: false,
						choresMissed: false,
						choresImpaired: false,
						socialMissed: false,
					},
		);
	}, [date, disabled, prefilled]);

	return (
		<div
			data-testid='migraine-panel'
			className={`
                overflow-hidden transition-all duration-300 ease-out
                will-change-transform
                ${isOpen ? 'opacity-100 translate-y-0 max-h-[2000px]' : 'opacity-0 translate-y-2 max-h-0 pointer-events-none'}
            `}
		>
			<div
				className='
                    space-y-5 max-w-md mx-auto mt-4 p-4 rounded-2xl
                    bg-transparent border border-white/20
                    shadow-lg shadow-black/30
                    backdrop-blur-xl
                '
			>
				<div className='flex justify-between items-center'>
					<button
						onClick={onClose}
						className='text-sm text-gray-400 hover:opacity-80 disabled:opacity-80 transition-opacity'
						disabled={isLoading}
					>
						Close
					</button>
					<h2 className='text-lg font-semibold'>
						{date.toLocaleDateString('de-DE', {
							day: '2-digit',
							month: '2-digit',
						})}
					</h2>
					{prefilled ? (
						<button
							data-testid='edit-button'
							onClick={() => setAreInputsDisabled(!areInputsDisabled)}
							className='text-sm text-gray-400 hover:opacity-80 disabled:opacity-80 transition-opacity'
							disabled={isLoading}
						>
							{areInputsDisabled ? (
								<PencilIcon className='h-5 w-5' />
							) : (
								<XMarkIcon className='h-5 w-5' />
							)}
						</button>
					) : (
						<div className='h-5 w-5' />
					)}
				</div>

				<Durations
					durations={durations}
					setDurations={setDurations}
					disabled={areInputsDisabled || isLoading}
				/>

				<Intensity
					intensity={intensity}
					setIntensity={setIntensity}
					disabled={areInputsDisabled || isLoading}
				/>

				<Symptoms
					symptoms={symptoms}
					setSymptoms={setSymptoms}
					disabled={areInputsDisabled || isLoading}
				/>

				{showMedicine && (
					<Medicine
						medicines={medicines}
						setMedicines={setMedicines}
						disabled={areInputsDisabled || isLoading}
					/>
				)}

				<Midas midas={midas} setMidas={setMidas} disabled={areInputsDisabled || isLoading} />

				{!areInputsDisabled && (
					<div className='flex justify-between pt-2'>
						<SubmitButton
							type={BUTTON_TYPES.BUTTON}
							label='Save'
							onClick={saveNewEntry}
							className={`
                                ${cacheFeedback === 'success' ? 'border-green-500/50 text-green-800' : ''}
                                ${cacheFeedback === 'error' ? 'border-red-500/50 text-red-800' : ''}
                                ${!cacheFeedback ? 'bg-gray-600/50 border-gray-700/20 text-white' : ''}
                            `}
						/>

						<SubmitButton
							type={BUTTON_TYPES.BUTTON}
							label={isLoading ? 'Submitting...' : 'Submit'}
							onClick={submitNewEntry}
							disabled={isLoading}
							className={`
                                ${saveFeedback === 'success' ? 'border-green-500/50 text-green-800' : ''}
                                ${saveFeedback === 'error' ? 'border-red-500/50 text-red-800' : ''}
                                ${!saveFeedback ? 'bg-purple-600/50 border-purple-700/20 text-white' : ''}
                            `}
						/>
					</div>
				)}
			</div>
		</div>
	);
}

export default MigrainePanel;
