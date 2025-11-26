import type { AppendMedicine, Entry } from "../../types";
import type { DescriptionEffectiveness, EventDescription, RawEventResponse, Event } from "../../types/calendar/event";
import { parseDecimalToTime } from "../date/date";

export const parseEventDescription = (event: RawEventResponse): EventDescription | null => {
    try {
        const description = typeof event.description === 'string' ? JSON.parse(event.description) : event.description;

        if (typeof description.effectiveness === 'string') {
            description.effectiveness = description.effectiveness.split(',') as DescriptionEffectiveness[];
        }

        if (typeof description.symptoms === 'string') {
            description.symptoms = description.symptoms.split(',').map((symptom: string) => symptom.trim());
        }

        return description;
    } catch {
        return null;
    }
};

export const formatMedicine = (medicine: AppendMedicine[]) => {
    const abbreviations = medicine.flatMap(item => {

        return new Array(item.taken).fill(item.medicine.abbreviation);
    });

    return abbreviations.join(',');
}

export const formatEffectiveness = (medicine: AppendMedicine[]) => {
    let effectivenessString: string = ''

    medicine.map(({taken, effectiveness}) => {
        for (let i = 0; i < (taken - effectiveness); i++) {
            effectivenessString += 'no,';
        }

        for (let i = 0; i < effectiveness; i++) {
            effectivenessString += 'yes,';
        }
    });

    return effectivenessString.slice(0, -1);
};

export const parseMedicineData = (medicine: string, effectiveness: DescriptionEffectiveness[]) => {
    const medicineArray = medicine.split(',').filter(med => med.trim() !== '');
    const medicineData = medicineArray.reduce<Record<string, { taken: number; effectiveness: number }>>((acc, med, index) => {
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

export const createEntry = (event: Event, selectedDate: Date): Entry => ({
    selectedDate,
    durations: event.description.duration.map(({ start, end }, index: number) => ({
        id: index,
        startTime: parseDecimalToTime(start),
        endTime: parseDecimalToTime(end),
    })),
    intensity: event.description.intensity,
    symptoms: event.description.symptoms,
    medicine: parseMedicineData(event.description.medicine, event.description.effectiveness),
    midas: event.description.midas || { workMissed: false, workImpaired: false, choresMissed: false, choresImpaired: false, socialMissed: false },
});
