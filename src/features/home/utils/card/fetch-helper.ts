import { fetchAreaChart, fetchDurationAmount, fetchMedicineAmount, fetchMidasScore, fetchMigraineAmount } from "../../../../shared/api/migraine.api";
import type { TimeFrameUnit } from "../../../../shared/constants/cards/time-frame";
import { getMohMedicineFilter } from "../../../../shared/utils/fetch-helper";
import { CARD_TYPES, type CardType } from "../../constants/card/card";

export async function fetchAreaData(
    cardType: CardType,
    endDate: string,
    count: number,
    unit: TimeFrameUnit,
    userId: string
) {
    if (cardType === CARD_TYPES.MOH) {
        const mohMedFilter = await getMohMedicineFilter(userId);

        return await fetchAreaChart(cardType, endDate, count, unit, { medicines: mohMedFilter });
    } else {
        return await fetchAreaChart(cardType, endDate, count, unit);
    }
}

export async function fetchPieData(
    cardType: CardType,
    startDate: string,
    endDate: string,
    totalDays: number,
    userId: string
) {
    switch (cardType) {
        case CARD_TYPES.MIGRAINE: {
            const migraineDays = await fetchMigraineAmount(startDate, endDate);
            return {
                data: [
                    { name: "Migraine", value: migraineDays },
                    { name: "No Migraine", value: totalDays - migraineDays },
                ],
                value: migraineDays,
            };
        }

        case CARD_TYPES.DURATION: {
            const duration = await fetchDurationAmount(startDate, endDate);
            return {
                data: [
                    { name: "Migraine Duration", value: duration },
                    { name: "No Migraine", value: (totalDays * 24) - duration },
                ],
                value: duration,
            };
        }

        case CARD_TYPES.MEDICINE: {
            const med = await fetchMedicineAmount(startDate, endDate);
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
            const mohMedFilter = await getMohMedicineFilter(userId);
            const medDays = await fetchMigraineAmount(startDate, endDate, { medicines: mohMedFilter });
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
