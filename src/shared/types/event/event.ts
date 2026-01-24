import type { IntensityType, MidasType, SymptomType } from "@/shared/constants/event/event-details";
import type { InputContent } from "@/shared/types/calendar/calendar";

export type EventFilter = {
    intensity: IntensityType | null;
    symptom: (SymptomType | 'any')[];
    medicine: (InputContent | { abbreviation: 'any', label: 'Any' })[];
    midas: MidasType[];
};
