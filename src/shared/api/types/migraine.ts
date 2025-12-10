import type { ChartType } from "@/features/home/constants/chart";

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

export type RawAreaChartResponse = {
    dataPoints: number[];
    labels: string[];
    type: ChartType;
};
