import type { MIDAS_TYPES } from "@/features/calendar/constants/calendar";

export type AppendDuration = {
    id: number;
    startTime: string;
    endTime: string;
};

export type InputContent = {
    abbreviation: string;
    label: string;
};

export type AppendMedicine = {
    medicine: InputContent;
    taken: number;
    effectiveness: number;
};

export type AppendMidas = {
    [MIDAS_TYPES.WORK_MISSED]: boolean;
    [MIDAS_TYPES.WORK_IMPAIRED]: boolean;
    [MIDAS_TYPES.CHORES_MISSED]: boolean;
    [MIDAS_TYPES.CHORES_IMPAIRED]: boolean;
    [MIDAS_TYPES.SOCIAL_MISSED]: boolean;
}
