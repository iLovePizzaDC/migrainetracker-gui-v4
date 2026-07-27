import Durations from '@/features/calendar/components/molecules/Durations';
import Intensity from '@/features/calendar/components/molecules/Intensity';
import Medicine from '@/features/calendar/components/molecules/Medicine';
import Midas from '@/features/calendar/components/molecules/Midas';
import Symptoms from '@/features/calendar/components/molecules/Symptoms';
import type { Entry } from '@/features/calendar/types/calendar';
import { useMigrainePanel } from '@/features/calendar/hooks/use-migraine-panel';
import MigrainePanelHeader from '@/features/calendar/components/molecules/MigrainePanelHeader';
import MigrainePanelActions from '@/features/calendar/components/molecules/MigrainePanelActions';

interface IMigrainePanel {
  date: Date;
  onClose: () => void;
  isOpen: boolean;
  prefilled?: Entry | null;
  disabled?: boolean;
}

function MigrainePanel({ date, onClose, isOpen, prefilled = null, disabled = false }: IMigrainePanel) {
  const {
    areInputsDisabled,
    setAreInputsDisabled,
    cacheFeedback,
    saveFeedback,
    isLoading,
    durations,
    setDurations,
    intensity,
    setIntensity,
    symptoms,
    setSymptoms,
    medicines,
    setMedicines,
    midas,
    setMidas,
    showMedicine,
    submitNewEntry,
    saveNewEntry,
  } = useMigrainePanel(date, onClose, disabled, prefilled);

  return (
    <div
      data-testid='migraine-panel'
      className={`
                overflow-hidden transition-all duration-300 ease-out
                will-change-transform
                ${isOpen ? 'opacity-100 translate-y-0 max-h-[2000px]' : 'opacity-0 translate-y-2 max-h-0 pointer-events-none'}
            `}
    >
      <div
        className='
                    space-y-5 max-w-md mx-auto mt-4 p-4 rounded-2xl
                    bg-transparent border border-white/20
                    shadow-lg shadow-black/30
                    backdrop-blur-xl
                '
      >
        <MigrainePanelHeader
          date={date}
          onClose={onClose}
          prefilled={prefilled}
          areInputsDisabled={areInputsDisabled}
          setAreInputsDisabled={setAreInputsDisabled}
          isLoading={isLoading}
        />

        <Durations durations={durations} setDurations={setDurations} disabled={areInputsDisabled || isLoading} />

        <Intensity intensity={intensity} setIntensity={setIntensity} disabled={areInputsDisabled || isLoading} />

        <Symptoms symptoms={symptoms} setSymptoms={setSymptoms} disabled={areInputsDisabled || isLoading} />

        {showMedicine && (
          <Medicine medicines={medicines} setMedicines={setMedicines} disabled={areInputsDisabled || isLoading} />
        )}

        <Midas midas={midas} setMidas={setMidas} disabled={areInputsDisabled || isLoading} />

        {!areInputsDisabled && (
          <MigrainePanelActions
            cacheFeedback={cacheFeedback}
            saveFeedback={saveFeedback}
            isLoading={isLoading}
            saveNewEntry={saveNewEntry}
            submitNewEntry={submitNewEntry}
          />
        )}
      </div>
    </div>
  );
}

export default MigrainePanel;
