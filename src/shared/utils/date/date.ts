export function parseTimeToDecimal(time: string): number {
    const [hours, minutes] = time.split(":").map(Number);
    const decimalTime = hours + minutes / 60;

    return parseFloat(decimalTime.toFixed(2));
}

export const parseDecimalToTime = (time: number) => {
    const hours = Math.floor(time);
    const minutes = Math.round(((time % 1) * 100 * 60) / 100);
    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
};
