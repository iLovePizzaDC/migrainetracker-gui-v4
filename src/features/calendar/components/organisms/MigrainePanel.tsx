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
			className={`
				grid transition-[grid-template-rows] duration-300 ease-out
				${isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}
			`}
		>
			<div className='overflow-hidden'>
				<div
					data-testid='migraine-panel'
					className={`
						mx-auto mt-4 max-w-5xl
						rounded-2xl border border-white/20
						bg-transparent p-4 sm:p-6
						shadow-lg shadow-black/30
						backdrop-blur-xl
						transition-[opacity,transform] duration-300 ease-out
						will-change-[opacity,transform]
						${isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none'}
					`}
				>
					<div className='space-y-6'>
						<MigrainePanelHeader
							date={date}
							onClose={onClose}
							prefilled={prefilled}
							areInputsDisabled={areInputsDisabled}
							setAreInputsDisabled={setAreInputsDisabled}
							isLoading={isLoading}
						/>
						<div className='grid gap-6 lg:grid-cols-2'>
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
			</div>
		</div>
	);
}

export default MigrainePanel;
