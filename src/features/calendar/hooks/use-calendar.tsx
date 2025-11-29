import { useContext } from "react";
import { CalendarContext } from "../context/calendar-context";

export const useCalendar = () => {
    const context = useContext(CalendarContext);
    if (!context) throw new Error('useCalendar must be used within a CalendarProvider');
    return context;
};
