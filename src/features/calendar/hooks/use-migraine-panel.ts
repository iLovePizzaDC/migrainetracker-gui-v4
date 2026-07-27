import { useCalendar } from '@/features/calendar/hooks/use-calendar';
import { fetchNewEntry } from '@/shared/api/migraine.api';
import { useEffect, useState } from 'react';
import { formatDateToUs } from '@/shared/utils/date/date';
import { FEEDBACK_TYPES, type FeedbackType } from '@/shared/constants/button/feedback';
import {
  INTENSITY_TYPES,
  SYMPTOM_TYPES,
  type IntensityType,
  type SymptomType,
} from '@/shared/constants/event/event-details';
import type { AppendDuration, AppendMedicine, AppendMidas } from '@/shared/types/calendar/calendar';
import type { Entry } from '@/features/calendar/types/calendar';

type UseMigrainePanelParams = {
  date: Date;
  prefilled?: Entry | null;
  disabled?: boolean;
  onClose: () => void;
};

export function useMigrainePanel({ date, prefilled = null, disabled = false, onClose }: UseMigrainePanelParams) {
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

  const [medicines, setMedicines] = useState<AppendMedicine[]>(prefilled ? prefilled.medicines : []);

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
      localStorage.setItem('MT_NE', JSON.stringify({ date, durations, intensity, symptoms, medicines, midas }));
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

    setDurations(prefilled ? prefilled.durations : [{ id: 0, startTime: '12:00', endTime: '13:00' }]);
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

  return {
    areInputsDisabled,
    setAreInputsDisabled,
    cacheFeedback,
    saveFeedback,
    isLoading,
    durations,
    setDurations,
    intensity,
    setIntensity,
    symptoms,
    setSymptoms,
    medicines,
    setMedicines,
    midas,
    setMidas,
    showMedicine,
    submitNewEntry,
    saveNewEntry,
  } as const;
}
