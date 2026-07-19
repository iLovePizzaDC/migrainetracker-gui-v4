import { MAX_MIDAS_SCORE } from '@/features/home/constants/midas';
import {
  fetchAreaChart,
  fetchDurationAmount,
  fetchMedicineAmount,
  fetchMidasScore,
  fetchMigraineAmount,
} from '@/shared/api/migraine.api';
import type { Filter } from '@/shared/api/types/event';
import { CARD_TYPES } from '@/shared/constants/event/card';
import {
  ANY_FILTER_OPTIONS,
  ANY_FILTER_TYPE,
  SYMPTOM_OPTIONS,
} from '@/shared/constants/event/event-details';
import type { CardType, TimeFrameUnit } from '@/shared/types/cards/card';
import type { EventFilter } from '@/shared/types/event/event';
import type { Medicine } from '@/shared/types/user/medicine';
import { formatDateToUs } from '@/shared/utils/date/date';
import { getMohMedicineFilter } from '@/shared/utils/fetch-helper';

const mapEventFilterToFilter = async (
  userMedicines: Medicine[],
  filter: EventFilter,
  isMoh: boolean = false,
): Promise<Filter> => {
  const mohMedFilter = isMoh ? await getMohMedicineFilter(userMedicines) : undefined;

  const medHasAny = filter.medicine.some(
    (medicine) => medicine.abbreviation === ANY_FILTER_OPTIONS.value,
  );

  let mappedMedicines: string | undefined = undefined;
  if (filter.medicine.length > 0) {
    mappedMedicines = medHasAny
      ? userMedicines.map((medicine) => medicine.abbreviation).join(',')
      : filter.medicine.map((medicine) => medicine.abbreviation).join(',');
  }

  let mappedSymptoms: string | undefined = undefined;
  if (filter.symptom.length > 0) {
    mappedSymptoms = filter.symptom.includes(ANY_FILTER_TYPE.ANY)
      ? SYMPTOM_OPTIONS.map((symptomOption) => symptomOption.value).join(',')
      : filter.symptom.join(',');
  }

  return {
    intensity: filter.intensity ?? undefined,
    symptoms: mappedSymptoms,
    medicines: isMoh ? mohMedFilter : mappedMedicines,
    effectiveness: filter.effectiveness ?? undefined,
  };
};

// TODO refactor
// TODO also add midas only for area charts which displays the score over the months
export async function fetchAreaData(
  cardType: CardType,
  endDate: string,
  count: number,
  unit: TimeFrameUnit,
  filter: EventFilter,
  userMedicines: Medicine[],
) {
  if (cardType === CARD_TYPES.MOH) {
    return await fetchAreaChart(
      cardType,
      endDate,
      count,
      unit,
      await mapEventFilterToFilter(userMedicines, filter, true),
    );
  } else {
    return await fetchAreaChart(
      cardType,
      endDate,
      count,
      unit,
      await mapEventFilterToFilter(userMedicines, filter),
    );
  }
}

export async function fetchPieData(
  cardType: CardType,
  startDate: string,
  endDate: string,
  totalDays: number,
  filter: EventFilter,
  userMedicines: Medicine[],
) {
  switch (cardType) {
    case CARD_TYPES.MIGRAINE: {
      const migraineDays = await fetchMigraineAmount(
        startDate,
        endDate,
        await mapEventFilterToFilter(userMedicines, filter),
      );

      return {
        data: [
          { name: 'Migraine', value: migraineDays },
          { name: 'No Migraine', value: totalDays - migraineDays },
        ],
        value: migraineDays,
      };
    }

    case CARD_TYPES.DURATION: {
      const duration = await fetchDurationAmount(
        startDate,
        endDate,
        await mapEventFilterToFilter(userMedicines, filter),
      );

      return {
        data: [
          { name: 'Migraine Duration', value: duration },
          { name: 'No Migraine', value: totalDays * 24 - duration },
        ],
        value: duration,
      };
    }

    case CARD_TYPES.MEDICINE: {
      const med = await fetchMedicineAmount(
        startDate,
        endDate,
        await mapEventFilterToFilter(userMedicines, filter),
      );

      return {
        data: [{ name: 'Medicine', value: med }],
        value: med,
      };
    }

    case CARD_TYPES.MOH: {
      const medDays = await fetchMigraineAmount(
        startDate,
        endDate,
        await mapEventFilterToFilter(userMedicines, filter, true),
      );
      const noMedDays = Math.max(totalDays - medDays, 0);

      return {
        data: [
          { name: 'Med-Days', value: medDays },
          { name: 'No Med-Days', value: noMedDays },
        ],
        value: medDays,
      };
    }

    default:
      return {
        data: [],
        value: 0,
      };
  }
}

export async function fetchMidasPieData() {
  const previousMonth = new Date();
  previousMonth.setMonth(previousMonth.getMonth() - 1);

  const twoMonthsAgo = new Date();
  twoMonthsAgo.setMonth(twoMonthsAgo.getMonth() - 2);

  const [currentScore, previousScore] = await Promise.all([
    fetchMidasScore(formatDateToUs(previousMonth)),
    fetchMidasScore(formatDateToUs(twoMonthsAgo)),
  ]);

  return {
    current: {
      score: currentScore,
      pieData: [
        { name: 'Current Score', value: currentScore },
        { name: 'Remaining', value: MAX_MIDAS_SCORE - currentScore },
      ],
    },
    previous: {
      score: previousScore,
      pieData: [
        { name: 'Previous Score', value: previousScore },
        { name: 'Remaining', value: MAX_MIDAS_SCORE - previousScore },
      ],
    },
  };
}
