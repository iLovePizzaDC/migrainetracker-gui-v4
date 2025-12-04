import type { InputContent } from "../../../shared/types/calendar/calendar";
import type { IntensityType, MidasType, SymptomType } from "../constants/calendar"

export type CalendarFilter = {
    intensity: IntensityType | null;
    symptom: SymptomType[];
    medicine: InputContent[];
    midas: MidasType[];
};
