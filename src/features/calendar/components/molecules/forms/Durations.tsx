import type { AppendDuration } from '@/shared/types/calendar';
import { PlusIcon, XMarkIcon } from '@heroicons/react/24/outline';
import TimePicker from '@/features/calendar/components/atoms/inputs/TimePicker';

interface IDurations {
	durations: AppendDuration[];
	onChange: (durations: AppendDuration[]) => void;
	disabled?: boolean;
}

function Durations({ durations, onChange, disabled = false }: IDurations) {
	const addDuration = () => {
		onChange([
			...durations,
			{
				id: Date.now(),
				startTime: '12:00',
				endTime: '13:00',
			},
		]);
	};

	const removeDuration = (id: number) => {
		onChange(durations.filter((duration) => duration.id !== id));
	};

	return (
		<div data-testid='durations' className='form-section'>
			<div className='flex items-center justify-between'>
				<h3 className='section-title'>Duration</h3>
				<button
					data-testid='add-button'
					onClick={addDuration}
					className={`icon-btn !h-8 !w-8 ${disabled ? 'invisible' : ''}`}
					aria-label='Add duration'
					disabled={disabled}
					tabIndex={disabled ? -1 : undefined}
				>
					<PlusIcon className='!h-4 !w-4' />
				</button>
			</div>

			{durations.map((duration, index) => (
				<div key={duration.id} className='space-y-2'>
					<div className='grid grid-cols-1 gap-3 sm:grid-cols-2'>
						<TimePicker
							id={`start-${index}`}
							label='Start'
							value={duration.startTime}
							onChange={(value) => {
								const updated = [...durations];
								updated[index].startTime = value;
								onChange(updated);
							}}
							disabled={disabled}
						/>
						<TimePicker
							id={`end-${index}`}
							label='End'
							value={duration.endTime}
							onChange={(value) => {
								const updated = [...durations];
								updated[index].endTime = value;
								onChange(updated);
							}}
							disabled={disabled}
						/>
					</div>

					{durations.length > 1 && !disabled && (
						<button
							onClick={() => removeDuration(duration.id)}
							className='motion-fade flex items-center gap-1 text-xs text-red-300/70 hover:text-red-300'
						>
							<XMarkIcon className='h-3.5 w-3.5' /> Remove
						</button>
					)}
				</div>
			))}
		</div>
	);
}

export default Durations;
