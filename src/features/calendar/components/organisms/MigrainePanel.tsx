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

interface IMigrainePanel {
    date: Date;
    onClose: () => void;
    prefilled?: Entry | null,
    disabled?: boolean;
}

function MigrainePanel({ date, onClose, prefilled = null, disabled = false }: IMigrainePanel) {
    const [areInputsDisabled, setAreInputsDisabled] = useState(disabled);

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

    const saveNewEntry = async () => {
        await fetchNewEntry(formatDateToUs(date), durations, intensity, symptoms, medicines, midas);
    };

    const cacheNewEntry = () => {
        localStorage.setItem('MT_NE', JSON.stringify({
            date,
            durations,
            intensity,
            symptoms,
            medicines,
            midas,
        }));
    };

    return (
        <div className="space-y-5 max-w-md mx-auto mt-4 p-4 rounded-2xl bg-transparent backdrop-blur-xl border border-white/20 shadow-lg shadow-black/30">
            <div className="flex justify-between items-center">
                <button
                    onClick={onClose}
                    className="text-sm text-gray-400 hover:opacity-80 transition-opacity"
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
                        className="text-sm text-gray-400 hover:opacity-80 transition-opacity"
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

            <Durations durations={durations} setDurations={setDurations} disabled={areInputsDisabled} />

            <Intensity intensity={intensity} setIntensity={setIntensity} disabled={areInputsDisabled} />

            <Symptoms symptoms={symptoms} setSymptoms={setSymptoms} disabled={areInputsDisabled} />

            <Medicine medicines={medicines} setMedicines={setMedicines} disabled={areInputsDisabled} />

            <Midas midas={midas} setMidas={setMidas} disabled={areInputsDisabled} />

            {!areInputsDisabled &&
                <div className="flex justify-between pt-2">
                    <button
                        onClick={cacheNewEntry}
                        className="px-4 py-2 rounded-lg bg-gray-600/50 backdrop-blur-xl border border-gray-700/20 shadow-sm shadow-black/30 hover:opacity-80 text-sm font-medium transition-opacity"
                    >
                        Cache
                    </button>
                    <button
                        onClick={saveNewEntry}
                        className="px-4 py-2 rounded-lg bg-purple-600/50 backdrop-blur-xl border border-purple-700/20 shadow-sm shadow-black/30 hover:opacity-80 text-sm font-medium transition-opacity"
                    >
                        Speichern
                    </button>
                </div>
            }
        </div>
    );
}

export default MigrainePanel;
