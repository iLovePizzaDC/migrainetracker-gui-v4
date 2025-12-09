import type { CardType } from "@/features/home/constants/card";
import type { ChartType } from "@/features/home/constants/chart";
import type { TimeFrameUnit } from "@/features/home/constants/time-frame";

export type ChartData = {
    name: string;
    [key: string]: number | string;
}[];

export type CardSetup = {
    index: number;
    title: string;
    cardType: CardType;
    chartType: ChartType;
    timeframe: {
        count: number;
        unit: TimeFrameUnit;
    }
}
