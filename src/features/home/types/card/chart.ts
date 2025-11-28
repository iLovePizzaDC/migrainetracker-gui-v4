import type { TimeFrameUnit } from "../../../../shared/constants/cards/time-frame";
import type { CardType } from "../../constants/card/card";
import type { ChartType } from "../../constants/card/chart";

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
