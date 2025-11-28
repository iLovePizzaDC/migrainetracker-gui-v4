import { fetchUserMedicinesGet } from "../../../../shared/api/medicine.api";
import { fetchAreaChart, fetchDurationAmount, fetchMedicineAmount, fetchMidasScore, fetchMigraineAmount } from "../../../../shared/api/migraine.api";
import type { TimeFrameUnit } from "../../../../shared/constants/cards/time-frame";
import type { Medicine } from "../../../../shared/types/user/medicine";
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
            return [
                { name: "Migraine", value: migraineDays },
                { name: "No Migraine", value: totalDays - migraineDays },
            ];
        }

        case CARD_TYPES.DURATION: {
            const duration = await fetchDurationAmount(startDate, endDate);
            return [
                { name: "Migraine Duration", value: duration },
                { name: "No Migraine", value: (totalDays * 24) - duration },
            ];
        }

        case CARD_TYPES.MEDICINE: {
            const med = await fetchMedicineAmount(startDate, endDate);
            const noMed = Math.max(totalDays - med, 0);
            return [
                { name: "Medicine", value: med },
                { name: "No Medicine", value: noMed },
            ];
        }

        case CARD_TYPES.MOH: {
            const mohMedFilter = await getMohMedicineFilter(userId);
            const medDays = await fetchMigraineAmount(startDate, endDate, { medicines: mohMedFilter });
            const noMedDays = Math.max(totalDays - medDays, 0);

            return [
                { name: "Med-Days", value: medDays },
                { name: "No Med-Days", value: noMedDays },
            ];
        }

        default:
            return [];
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

async function getMohMedicineFilter(userId: string) {
    const medicines: Medicine[] = await fetchUserMedicinesGet(userId);

    return medicines
        .filter((medicine: Medicine) => medicine.type === "migraine-painkiller" || medicine.type === "painkiller")
        .map((medicine: Medicine) => medicine.abbreviation)
        .join(",");
}
