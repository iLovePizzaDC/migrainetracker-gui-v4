type DescriptionSymptoms = 'noi' | 'lig' | 'sme' | 'vis' | 'diz' | 'nau' | 'vom';

export type DescriptionEffectiveness = 'yes' | 'no' | '';

export type EventDescription = {
    duration:{
        start: number,
        end: number
    }[],
    intensity: 'very-high' | 'high' | 'medium' | 'low',
    symptoms: DescriptionSymptoms[],
    medicine: string,
    effectiveness: DescriptionEffectiveness[],
    midas: {
        workMissed: boolean;
        workImpaired: boolean;
        choresMissed: boolean;
        choresImpaired: boolean;
        socialMissed: boolean;
    }
};

type EventCreator = {
    email: string;
    self: boolean;
};

type EventOrganizer = {
    email: string;
    self: boolean;
};

type EventStartEnd = {
    date: string;
    timeZone: string | null;
};

export type RawEventResponse = {
    kind: string;
    etag: string;
    id: string;
    status: string;
    htmlLink: string;
    created: string;
    updated: string;
    summary: string;
    description: string;
    visibility: string;
    colorId: string;
    creator: EventCreator;
    organizer: EventOrganizer;
    transparency: string;
    sequence: string;
    reminders: {
        useDefault: boolean;
    };
    eventType: string;
    start: EventStartEnd;
    end: EventStartEnd;
    recurrence: unknown | null;
    icalUID: string;
};

export type Event = {
    date: Date;
    description: EventDescription;
    strength: `bg-purple-${50 | 100 | 150 | 200 | 250 | 300 | 350 | 400 | 450 | 500 | 550 | 600 | 650 | 700 | 750 | 800 | 850 | 900 | 950}`
}
