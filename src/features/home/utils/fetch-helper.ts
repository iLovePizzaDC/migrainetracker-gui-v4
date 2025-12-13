import { fetchAreaChart, fetchDurationAmount, fetchMedicineAmount, fetchMidasScore, fetchMigraineAmount } from "@/shared/api/migraine.api";
import type { Filter } from "@/shared/api/types/migraine";
import { CARD_TYPES } from "@/shared/constants/event/card";
import type { CardType, TimeFrameUnit } from "@/shared/types/cards/card";
import type { EventFilter } from "@/shared/types/event/event";
import { getMohMedicineFilter } from "@/shared/utils/fetch-helper";

const mapEventFilterToFilter = async (
    userId: string,
    filter: EventFilter,
    isMoh: boolean = false
): Promise<Filter> => {
    const mohMedFilter = isMoh ? await getMohMedicineFilter(userId) : undefined;

    const medHasAny = filter.medicine.some(m => m.abbreviation === "any");

    const mappedMedicines = filter.medicine.length === 0 || medHasAny
        ? undefined
        : filter.medicine.map(m => m.abbreviation).join(",");

    const mappedSymptoms = filter.symptom.length === 0 || filter.symptom.includes("any")
        ? undefined
        : filter.symptom.join(",");

    return {
        intensity: filter.intensity ?? undefined,
        symptoms: mappedSymptoms,
        medicines: isMoh ? mohMedFilter : mappedMedicines,
    };
};

// TODO refactor
export async function fetchAreaData(
    cardType: CardType,
    endDate: string,
    count: number,
    unit: TimeFrameUnit,
    userId: string,
    filter: EventFilter,
) {
    if (cardType === CARD_TYPES.MOH) {

        return await fetchAreaChart(
            cardType,
            endDate,
            count,
            unit,
            await mapEventFilterToFilter(userId, filter, true),
        );
    } else {

        return await fetchAreaChart(
            cardType,
            endDate,
            count,
            unit,
            await mapEventFilterToFilter(userId, filter),
        );
    }
}

export async function fetchPieData(
    cardType: CardType,
    startDate: string,
    endDate: string,
    totalDays: number,
    userId: string,
    filter: EventFilter,
) {
    switch (cardType) {
        case CARD_TYPES.MIGRAINE: {
            const migraineDays = await fetchMigraineAmount(
                startDate,
                endDate,
                await mapEventFilterToFilter(userId, filter),
            );

            return {
                data: [
                    { name: "Migraine", value: migraineDays },
                    { name: "No Migraine", value: totalDays - migraineDays },
                ],
                value: migraineDays,
            };
        }

        case CARD_TYPES.DURATION: {
            const duration = await fetchDurationAmount(
                startDate,
                endDate,
                await mapEventFilterToFilter(userId, filter),
            );

            return {
                data: [
                    { name: "Migraine Duration", value: duration },
                    { name: "No Migraine", value: (totalDays * 24) - duration },
                ],
                value: duration,
            };
        }

        case CARD_TYPES.MEDICINE: {
            const med = await fetchMedicineAmount(
                startDate,
                endDate,
                await mapEventFilterToFilter(userId, filter),
            );

            const noMed = Math.max(totalDays - med, 0);
            return {
                data: [
                    { name: "Medicine", value: med },
                    { name: "No Medicine", value: noMed },
                ],
                value: med,
            };
        }

        case CARD_TYPES.MOH: {
            const medDays = await fetchMigraineAmount(
                startDate,
                endDate,
                await mapEventFilterToFilter(userId, filter, true),
            );
            const noMedDays = Math.max(totalDays - medDays, 0);

            return {
                data: [
                    { name: "Med-Days", value: medDays },
                    { name: "No Med-Days", value: noMedDays },
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
    const midasScore = await fetchMidasScore();

    return {
        midasScore,
        data: [
            { name: "Midas Score", value: midasScore },
            { name: "Remaining", value: 270 },
        ]
    };
}
