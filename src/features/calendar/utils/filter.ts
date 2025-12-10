import type { CalendarFilter } from "@/features/calendar/types/calendar";
import type { Event } from "@/features/calendar/types/event";

export function filterEvents(parsedEvent: Event, filter: CalendarFilter) {
    const { intensity, symptoms, medicine, midas } = parsedEvent.description;
    const {
        intensity: intensityFilter,
        symptom: symptomsFilter,
        medicine: medicineFilter,
        midas: midasFilter,
    } = filter;

    if (intensityFilter && intensity !== intensityFilter) {
        return false;
    }

    if (symptomsFilter.length > 0) {
        const missingSymptom = symptomsFilter.some(symptom => {
            if (symptom === 'any') {
                return symptoms.length === 0;
            } else {
                return !symptoms.includes(symptom)
            }
        });
        if (missingSymptom) return false;
    }

    if (medicineFilter.length > 0) {
        const allowedMedicines = medicineFilter.map(m => m.abbreviation.toLowerCase());

        const eventMedicines = medicine
            .split(",")
            .map(m => m.trim().toLowerCase())
            .filter(Boolean);

        const missing = allowedMedicines.some(medicine => {
            if (medicine === 'any') {
                return eventMedicines.length === 0;
            } else {
                return !eventMedicines.includes(medicine)
            }
        });
        if (missing) return false;
    }

    if (midasFilter.length > 0) {
        const missingMidas = midasFilter.some(key => !midas[key]);
        if (missingMidas) return false;
    }

    return true;
}
