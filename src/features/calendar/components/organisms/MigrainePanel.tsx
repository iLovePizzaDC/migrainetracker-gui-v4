import type { Entry } from '@/features/calendar/types/calendar';
import { useMigrainePanel } from '@/features/calendar/hooks/use-migraine-panel';
import MigrainePanelHeader from '@/features/calendar/components/molecules/content/MigrainePanelHeader';
import Durations from '@/features/calendar/components/molecules/forms/Durations';
import Intensity from '@/features/calendar/components/molecules/forms/Intensity';
import Symptoms from '@/features/calendar/components/molecules/forms/Symptoms';
import Medicine from '@/features/calendar/components/molecules/forms/Medicine';
import Midas from '@/features/calendar/components/molecules/forms/Midas';
import MigrainePanelActions from '@/features/calendar/components/molecules/MigrainePanelActions';

interface IMigrainePanel {
	date: Date;
	onClose: () => void;
	isOpen: boolean;
	prefilled?: Entry | null;
	disabled?: boolean;
}

function MigrainePanel({
	date,
	onClose,
	isOpen,
	prefilled = null,
	disabled = false,
}: IMigrainePanel) {
	const {
		areInputsDisabled,
		setAreInputsDisabled,
		cacheFeedback,
		saveFeedback,
		isLoading,
		form,
		updateForm,
		showMedicine,
		submitNewEntry,
		saveNewEntry,
	} = useMigrainePanel(date, onClose, disabled, prefilled);

	const inputsDisabled = areInputsDisabled || isLoading;

	return (
		<div
			data-testid='migraine-panel-reveal'
			className={`
				grid motion-reveal
				${isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}
			`}
		>
			<div className='min-h-0 overflow-hidden'>
				<div
					data-testid='migraine-panel'
					className='glass-panel mx-auto max-w-5xl p-4 sm:p-6'
				>
					<div className='space-y-5'>
						<MigrainePanelHeader
							date={date}
							onClose={onClose}
							prefilled={prefilled}
							areInputsDisabled={areInputsDisabled}
							setAreInputsDisabled={setAreInputsDisabled}
							isLoading={isLoading}
						/>
						<div className='grid items-start gap-x-8 gap-y-5 lg:grid-cols-2'>
							<Durations
								durations={form.durations}
								onChange={(durations) => updateForm('durations', durations)}
								disabled={inputsDisabled}
							/>
							<Intensity
								intensity={form.intensity}
								onChange={(intensity) => updateForm('intensity', intensity)}
								disabled={inputsDisabled}
							/>
							<Symptoms
								symptoms={form.symptoms}
								onChange={(symptoms) => updateForm('symptoms', symptoms)}
								disabled={inputsDisabled}
							/>
							{showMedicine && (
								<Medicine
									medicines={form.medicines}
									onChange={(medicines) => updateForm('medicines', medicines)}
									disabled={inputsDisabled}
								/>
							)}
							<Midas
								midas={form.midas}
								onChange={(midas) => updateForm('midas', midas)}
								disabled={inputsDisabled}
							/>
						</div>
						<div className={areInputsDisabled ? 'invisible pointer-events-none' : undefined}>
							<MigrainePanelActions
								cacheFeedback={cacheFeedback}
								saveFeedback={saveFeedback}
								isLoading={isLoading}
								saveNewEntry={saveNewEntry}
								submitNewEntry={submitNewEntry}
							/>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default MigrainePanel;
