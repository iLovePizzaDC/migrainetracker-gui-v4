import type { EventDescription } from "../../../shared/types";
import { STRENGTH_MAP } from "../constants/calendar";
import type { Event } from "../../../shared/types/calendar/event";

export function determineStrength(description: EventDescription): Event["strength"] {
    const totalDuration = description.duration.reduce((sum, range) => sum + (range.end - range.start), 0);
    let baseStrength = 200;

    if (description.intensity === "very-high") {
        baseStrength += 500;
    } else if (description.intensity === "high") {
        baseStrength += 350;
    } else if (description.intensity === "medium") {
        baseStrength += 200;
    } else if (description.intensity === "low") {
        baseStrength += 100;
    }

    if (totalDuration > 12) {
        baseStrength += 300;
    } else if (totalDuration > 8) {
        baseStrength += 200;
    } else if (totalDuration > 4) {
        baseStrength += 100;
    } else if (totalDuration > 2) {
        baseStrength += 50;
    }

    const validStrengths = Object.keys(STRENGTH_MAP).map(Number);
    const closestStrength = validStrengths.reduce((prev, curr) =>
        Math.abs(curr - baseStrength) < Math.abs(prev - baseStrength) ? curr : prev
    );

    return STRENGTH_MAP[closestStrength] ?? "bg-purple-200";
}
