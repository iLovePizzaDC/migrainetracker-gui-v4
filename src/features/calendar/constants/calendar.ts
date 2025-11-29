import type { InputContent } from "../../../shared/types/calendar/calendar";
import type { Event } from "../../../shared/types/calendar/event";

export const INTENSITIES: InputContent[] = [
    { abbreviation: "very-high", label: "Very High" },
    { abbreviation: "high", label: "High" },
    { abbreviation: "medium", label: "Medium" },
    { abbreviation: "low", label: "Low" },
];

export const SYMPTOMS: InputContent[] = [
    { abbreviation: "noi", label: "Noise Sensitive" },
    { abbreviation: "lig", label: "Light Sensitive" },
    { abbreviation: "sme", label: "Smell Sensitive" },
    { abbreviation: "vis", label: "Vision Problems" },
    { abbreviation: "diz", label: "Dizzy" },
    { abbreviation: "nau", label: "Nausea" },
    { abbreviation: "vom", label: "Vomit" },
    { abbreviation: "ne", label: "Neck Pain" },
    { abbreviation: "ja", label: "Jaw Pain" },
];

export const MIDAS_OPTIONS: InputContent[] = [
    { abbreviation: "workMissed", label: "I missed work" },
    { abbreviation: "workImpaired", label: "my work performance was reduced" },
    { abbreviation: "choresMissed", label: "I missed household chores" },
    { abbreviation: "choresImpaired", label: "my ability to do household chores was reduced" },
    { abbreviation: "socialMissed", label: "I missed social activities" },
];

export const STRENGTH_MAP: Record<number, Event["strength"]> = {
    200: "bg-purple-200",
    300: "bg-purple-300",
    400: "bg-purple-400",
    500: "bg-purple-500",
    600: "bg-purple-600",
    700: "bg-purple-700",
    800: "bg-purple-800",
    900: "bg-purple-900",
    950: "bg-purple-950"
};
