import { ITEM_HEIGHT, PICKER_HOURS, PICKER_MINUTES } from "@/features/calendar/constants/time-picker";
import { clamp } from "@/features/calendar/utils/scroll-snap-helper";
import { useEffect, useRef } from "react";

export function useScrollSnapPicker(open: boolean, selectedHour: string, selectedMinute: string) {
    const inputRef = useRef<HTMLInputElement>(null);
    const pickerRef = useRef<HTMLDivElement>(null);
    const hourRef = useRef<HTMLDivElement>(null);
    const minuteRef = useRef<HTMLDivElement>(null);
    const scrollTimeout = useRef<number | null>(null);

    useEffect(() => {
        if (!open) return;

        const hIndex = PICKER_HOURS.indexOf(selectedHour);
        const mIndex = PICKER_MINUTES.indexOf(selectedMinute);

        if (hourRef.current) {
            hourRef.current.scrollTop = hIndex * ITEM_HEIGHT;
        }

        if (minuteRef.current) {
            minuteRef.current.scrollTop = mIndex * ITEM_HEIGHT;
        }

    }, [open, selectedHour, selectedMinute]);

    const scrollToIndex = (
        ref: React.RefObject<HTMLDivElement | null>,
        index: number
    ) => {
        ref.current?.scrollTo({
            top: index * ITEM_HEIGHT,
            behavior: "smooth",
        });
    };

    const handleScrollEnd = (
        el: HTMLDivElement,
        values: string[],
        onSelect: (v: string) => void
    ) => {
        const index = clamp(
            Math.round(el.scrollTop / ITEM_HEIGHT),
            0,
            values.length - 1
        );

        el.scrollTo({
            top: index * ITEM_HEIGHT,
            behavior: "smooth",
        });

        onSelect(values[index]);
    };

    const handleScroll = (
        e: React.UIEvent<HTMLDivElement>,
        values: string[],
        onSelect: (v: string) => void
    ) => {
        inputRef.current?.blur();

        if (scrollTimeout.current) {
            clearTimeout(scrollTimeout.current);
        }

        const el = e.currentTarget;

        scrollTimeout.current = window.setTimeout(() => {
            handleScrollEnd(el, values, onSelect);
        }, 80);
    };

    return {
        inputRef, pickerRef, hourRef, minuteRef,
        scrollToIndex, handleScroll,
    }
}
