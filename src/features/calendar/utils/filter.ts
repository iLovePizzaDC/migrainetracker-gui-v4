import type { Event } from "../../../shared/types";
import type { CalendarFilter } from "../types/calendar";

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
        const missingSymptom = symptomsFilter.some(s => !symptoms.includes(s));
        if (missingSymptom) return false;
    }

    if (medicineFilter.length > 0) {
        const allowed = medicineFilter.map(m => m.abbreviation.toLowerCase());

        const eventMedicines = medicine
            .split(",")
            .map(m => m.trim().toLowerCase())
            .filter(Boolean);

        const missing = allowed.some(a => !eventMedicines.includes(a));
        if (missing) return false;
    }

    if (midasFilter.length > 0) {
        const missingMidas = midasFilter.some(key => !midas[key]);
        if (missingMidas) return false;
    }

    return true;
}
