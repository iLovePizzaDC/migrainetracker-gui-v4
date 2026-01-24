import Datepicker from "@/features/calendar/components/atoms/DatePicker";
import type { AppendDuration } from "@/shared/types/calendar/calendar";
import { XMarkIcon } from "@heroicons/react/24/outline";

interface IDurations {
    durations: AppendDuration[];
    setDurations: React.Dispatch<React.SetStateAction<AppendDuration[]>>;
    disabled?: boolean;
}

function Durations({ durations, setDurations, disabled = false }: IDurations) {
    const addDuration = () => {
        setDurations(prev => [
            ...prev,
            { id: Date.now(), startTime: "12:00", endTime: "13:00" }
        ]);
    };

    const removeDuration = (id: number) => {
        setDurations(prev => prev.filter(d => d.id !== id));
    };

    return (
        <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-3">
            <div className="flex justify-between items-center">
                <h3 className="text-sm font-medium text-purple-300">
                    Duration
                </h3>

                {!disabled &&
                    <button
                        onClick={addDuration}
                        className="px-2 py-1 text-xs rounded-lg bg-purple-600/50 backdrop-blur-xl border border-purple-700/20 shadow-black/30 hover:opacity-80 transition-opacity"
                    >
                        Add
                    </button>
                }
            </div>

            {durations.map((duration, index) => (
                <div key={duration.id} className="space-y-2">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <div className="min-w-0">
                            <Datepicker
                                id={`start-${index}`}
                                label="Start"
                                value={duration.startTime}
                                onChange={value => {
                                    const updated = [...durations];
                                    updated[index].startTime = value;
                                    setDurations(updated);
                                }}
                                disabled={disabled}
                            />
                        </div>
                        <div className="min-w-0">
                            <Datepicker
                                id={`end-${index}`}
                                label="End"
                                value={duration.endTime}
                                onChange={value => {
                                    const updated = [...durations];
                                    updated[index].endTime = value;
                                    setDurations(updated);
                                }}
                                disabled={disabled}
                            />
                        </div>
                    </div>

                    {(durations.length > 1 && !disabled) && (
                        <button
                            onClick={() => removeDuration(duration.id)}
                            className="flex items-center gap-1 text-xs text-red-300 hover:opacity-80 transition-opacity"
                        >
                            <XMarkIcon className="h-3 w-3" /> Remove
                        </button>
                    )}
                </div>
            ))}
        </div>
    );
}

export default Durations;
