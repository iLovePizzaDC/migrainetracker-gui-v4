import type { IntensityType, MidasType, SymptomType } from "@/features/calendar/constants/calendar";
import type { AppendDuration, AppendMedicine, AppendMidas, InputContent } from "@/shared/types/calendar/calendar";

export type CalendarFilter = {
    intensity: IntensityType | null;
    symptom: SymptomType[];
    medicine: InputContent[];
    midas: MidasType[];
};

export type Entry = {
    durations: AppendDuration[];
    intensity: IntensityType;
    symptoms: SymptomType[];
    medicines: AppendMedicine[];
    midas: AppendMidas;
}

export type StoredEntry = Entry & {
    date: Date;
}
