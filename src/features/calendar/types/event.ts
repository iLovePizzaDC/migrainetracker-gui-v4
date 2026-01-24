import type { SymptomType } from "@/shared/constants/event/event-details";

export type DescriptionEffectiveness = 'yes' | 'no' | '';

export type EventDescription = {
    duration: {
        start: number,
        end: number
    }[],
    intensity: 'very-high' | 'high' | 'medium' | 'low',
    symptoms: SymptomType[],
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

export type Event = {
    date: Date;
    description: EventDescription;
    strength: `bg-purple-${50 | 100 | 150 | 200 | 250 | 300 | 350 | 400 | 450 | 500 | 550 | 600 | 650 | 700 | 750 | 800 | 850 | 900 | 950}`
}
