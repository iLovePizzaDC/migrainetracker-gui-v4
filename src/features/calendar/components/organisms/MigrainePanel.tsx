import { useState } from "react";
import {
    INTENSITY_TYPES,
    SYMPTOM_TYPES,
    type IntensityType,
    type SymptomType
} from "../../constants/calendar";
import type {
    AppendDuration,
    AppendMedicine,
    AppendMidas,
    Entry
} from "../../../../shared/types";
import Durations from "../molecules/Durations";
import Intensity from "../molecules/Intensity";
import Symptoms from "../molecules/Symptoms";
import Midas from "../molecules/Midas";
import { fetchNewEntry } from "../../../../shared/api/migraine.api";
import { formatDateToUs } from "../../../../shared/utils/date/date";
import Medicine from "../molecules/Medicine";
import { PencilIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { useCalendar } from "../../hooks/use-calendar";

interface IMigrainePanel {
    date: Date;
    onClose: () => void;
    prefilled?: Entry | null,
    disabled?: boolean;
}

function MigrainePanel({ date, onClose, prefilled = null, disabled = false }: IMigrainePanel) {
    const { refetchEvents } = useCalendar();

    const [areInputsDisabled, setAreInputsDisabled] = useState(disabled);
    const [cacheFeedback, setCacheFeedback] = useState<"success" | "error" | null>(null); // TODO outsource into consts
    const [saveFeedback, setSaveFeedback] = useState<"success" | "error" | null>(null); // TODO outsource into consts
    const [isLoading, setIsLoading] = useState(false);

    const [durations, setDurations] = useState<AppendDuration[]>(prefilled
        ? prefilled.durations
        : [{ id: 0, startTime: "12:00", endTime: "13:00" }]
    );

    const [intensity, setIntensity] = useState<IntensityType>(prefilled
        ? prefilled.intensity
        : INTENSITY_TYPES.MEDIUM
    );

    const [symptoms, setSymptoms] = useState<SymptomType[]>(prefilled
        ? prefilled.symptoms
        : [SYMPTOM_TYPES.NOISE, SYMPTOM_TYPES.LIGHT]
    );

    const [medicines, setMedicines] = useState<AppendMedicine[]>(prefilled
        ? prefilled.medicines
        : []
    );

    const [midas, setMidas] = useState<AppendMidas>(prefilled
        ? prefilled.midas
        : {
            workMissed: false,
            workImpaired: false,
            choresMissed: false,
            choresImpaired: false,
            socialMissed: false
        }
    );

    const showMedicine =
        !prefilled ||
        !areInputsDisabled ||
        medicines.length > 0;

    const saveNewEntry = async () => {
        try {
            setIsLoading(true);
            await fetchNewEntry(formatDateToUs(date), durations, intensity, symptoms, medicines, midas);
            setSaveFeedback("success");
            await refetchEvents();
            onClose();
        } catch (err) {
            console.error(err);
            setSaveFeedback("error");
        } finally {
            setIsLoading(false);
        }
    };

    const cacheNewEntry = () => {
        try {
            localStorage.setItem(
                "MT_NE",
                JSON.stringify({ date, durations, intensity, symptoms, medicines, midas })
            );
            setCacheFeedback("success");
            setTimeout(() => onClose(), 500);
        } catch (err) {
            console.error(err);
            setCacheFeedback("error");
        }
    };

    return (
        <div className="space-y-5 max-w-md mx-auto mt-4 p-4 rounded-2xl bg-transparent backdrop-blur-xl border border-white/20 shadow-lg shadow-black/30">
            <div className="flex justify-between items-center">
                <button
                    onClick={onClose}
                    className="text-sm text-gray-400 hover:opacity-80 disabled:opacity-80 transition-opacity"
                    disabled={isLoading}
                >
                    Close
                </button>
                <h2 className="text-lg font-semibold">
                    {date.toLocaleDateString('de-DE', {
                        day: '2-digit',
                        month: '2-digit',
                    })}
                </h2>
                {prefilled ? (
                    <button
                        onClick={() => setAreInputsDisabled(!areInputsDisabled)}
                        className="text-sm text-gray-400 hover:opacity-80 disabled:opacity-80 transition-opacity"
                        disabled={isLoading}
                    >
                        {areInputsDisabled ? (
                            <PencilIcon className="h-4 w-4" />
                        ) : (
                            <XMarkIcon className="h-4 w-4" />
                        )}
                    </button>
                ) : (
                    <div className="h-4 w-4" />
                )}
            </div>

            <Durations durations={durations} setDurations={setDurations} disabled={areInputsDisabled || isLoading} />

            <Intensity intensity={intensity} setIntensity={setIntensity} disabled={areInputsDisabled || isLoading} />

            <Symptoms symptoms={symptoms} setSymptoms={setSymptoms} disabled={areInputsDisabled || isLoading} />

            {showMedicine &&
                <Medicine medicines={medicines} setMedicines={setMedicines} disabled={areInputsDisabled || isLoading} />
            }

            <Midas midas={midas} setMidas={setMidas} disabled={areInputsDisabled || isLoading} />

            {!areInputsDisabled &&
                <div className="flex justify-between pt-2">
                    <button
                        onClick={cacheNewEntry}
                        className={`
                            px-4 py-2 rounded-lg backdrop-blur-xl border shadow-sm shadow-black/30 text-sm font-medium transition-opacity
                            ${cacheFeedback === "success" ? "border-green-500/50 text-green-800" : ""}
                            ${cacheFeedback === "error" ? "border-red-500/50 text-red-800" : ""}
                            ${!cacheFeedback ? "bg-gray-600/50 border-gray-700/20 text-white" : ""}
                            hover:opacity-80 disabled:opacity-80
                        `}
                    >
                        Cache
                    </button>

                    <button
                        onClick={saveNewEntry}
                        disabled={isLoading}
                        className={`
                            px-4 py-2 rounded-lg backdrop-blur-xl border shadow-sm shadow-black/30 text-sm font-medium transition-opacity
                            ${saveFeedback === "success" ? "border-green-500/50 text-green-800" : ""}
                            ${saveFeedback === "error" ? "border-red-500/50 text-red-800" : ""}
                            ${!saveFeedback ? "bg-purple-600/50 border-purple-700/20 text-white" : ""}
                            hover:opacity-80 disabled:opacity-80
                        `}
                    >
                        {isLoading ? "Saving..." : "Save"}
                    </button>
                </div>
            }
        </div>
    );
}

export default MigrainePanel;
