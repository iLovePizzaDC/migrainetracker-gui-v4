export type AppendDuration = {
    id: number;
    startTime: string;
    endTime: string;
};

export type AppendDurationField = 'startTime' | 'endTime';

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
    workMissed: boolean;
    workImpaired: boolean;
    choresMissed: boolean;
    choresImpaired: boolean;
    socialMissed: boolean;
}

export type Entry = {
    selectedDate: Date;
    durations: AppendDuration[];
    intensity: string;
    symptoms: string[];
    medicine: AppendMedicine[];
    midas: AppendMidas;
}

export type FormStatus = 'default' | 'success' | 'error';
