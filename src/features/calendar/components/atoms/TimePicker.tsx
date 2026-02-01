import { useClickOutside } from "@/shared/hooks/use-click-outside";
import { useRef, useState } from "react";

interface ITimePicker {
    id: string;
    label: string;
    value: string;
    onChange: (value: string) => void;
    required?: boolean;
    disabled?: boolean;
}

function TimePicker({
    id,
    label,
    value,
    onChange,
    required = false,
    disabled = false,
}: ITimePicker) {
    const inputRef = useRef<HTMLInputElement>(null);
    const pickerRef = useRef<HTMLDivElement>(null);

    const [open, setOpen] = useState(false);

    useClickOutside([inputRef, pickerRef], () => setOpen(false));

    const hours = Array.from({ length: 24 }, (_, i) =>
        String(i).padStart(2, "0")
    );
    const minutes = ["00", "05", "10", "15", "20", "25", "30", "35", "40", "45", "50", "55", "59"];

    const [selectedHour, selectedMinute] = value.split(":");

        const normalizeTime = (input: string) => {
        const cleaned = input.replace(/[^\d:]/g, "");

        const [hourString = "", minuteString = ""] = cleaned.split(":");

        const hour = Math.min(23, Number(hourString || 0));
        const minute = Math.min(59, Number(minuteString || 0));

        if (cleaned.includes(":")) {
            return `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
        }

        return cleaned;
    }

    return (
        <div className="relative w-full space-y-1">
            <label
                htmlFor={id}
                className="block text-sm font-medium cursor-pointer"
                onClick={() => inputRef.current?.focus()}
            >
                {label}
            </label>

            <input
                ref={inputRef}
                id={id}
                type="text"
                inputMode="numeric"
                placeholder="HH:mm"
                value={value}
                required={required}
                disabled={disabled}
                onFocus={() => setOpen(true)}
                onChange={(e) => onChange(normalizeTime(e.target.value))}
                className="w-full p-2 rounded-lg bg-black/10 backdrop-blur-sm border border-white/20 text-white text-sm focus:outline-none focus:ring-1 focus:ring-white/40"
            />

            {open && (
                <div
                    ref={pickerRef}
                    className="absolute z-20 mt-1 flex gap-2 rounded-lg bg-black/30 backdrop-blur-md border border-white/20 p-2"
                >
                    <div className="max-h-40 pr-1 overflow-auto">
                        {hours.map(hour => (
                            <button
                                key={hour}
                                type="button"
                                className={`block px-4 py-1 rounded text-white hover:bg-white/20 ${
                                    hour === selectedHour ? "bg-white/20" : ""
                                }`}
                                onClick={() => onChange(`${hour}:${selectedMinute || "00"}`)}
                            >
                                {hour}
                            </button>
                        ))}
                    </div>

                    <div className="max-h-40 pr-1 overflow-auto">
                        {minutes.map(minute => (
                            <button
                                key={minute}
                                type="button"
                                className={`block px-4 py-1 rounded text-white hover:bg-white/20 ${
                                    minute === selectedMinute ? "bg-white/20" : ""
                                }`}
                                onClick={() => onChange(`${selectedHour || "00"}:${minute}`)}
                            >
                                {minute}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

export default TimePicker;
