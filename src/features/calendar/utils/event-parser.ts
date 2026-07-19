import type { Entry } from '@/features/calendar/types/calendar';
import type {
  DescriptionEffectiveness,
  MigraineDescription,
  MigraineEvent,
  ProphylaxisDescription,
} from '@/features/calendar/types/event';
import type { RawEventResponse } from '@/shared/api/types/event';
import { parseDecimalToTime } from '@/shared/utils/date/date';

export const parseMigraineEventDescription = (
  event: RawEventResponse,
): MigraineDescription | null => {
  try {
    const description =
      typeof event.description === 'string' ? JSON.parse(event.description) : event.description;

    if (typeof description.effectiveness === 'string') {
      description.effectiveness = description.effectiveness.split(
        ',',
      ) as DescriptionEffectiveness[];
    }

    if (typeof description.symptoms === 'string') {
      description.symptoms = description.symptoms
        .split(',')
        .map((symptom: string) => symptom.trim());
    }

    return description;
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
