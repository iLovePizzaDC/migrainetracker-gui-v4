import TimePicker from '@/features/calendar/components/atoms/TimePicker';
import type { AppendDuration } from '@/shared/types/calendar/calendar';
import { PlusCircleIcon, XMarkIcon } from '@heroicons/react/24/outline';

interface IDurations {
	durations: AppendDuration[];
	setDurations: React.Dispatch<React.SetStateAction<AppendDuration[]>>;
	disabled?: boolean;
}

function Durations({ durations, setDurations, disabled = false }: IDurations) {
	const addDuration = () => {
		setDurations((prev) => [...prev, { id: Date.now(), startTime: '12:00', endTime: '13:00' }]);
	};

	const removeDuration = (id: number) => {
		setDurations((prev) => prev.filter((d) => d.id !== id));
	};

	return (
		<div
			data-testid='durations'
			className='p-4 rounded-xl bg-white/5 border border-white/10 space-y-3'
		>
			<div className='flex w-full items-center justify-between'>
				<div className='w-5'></div>
				<h3 className='text-sm font-medium text-purple-300 text-center flex-1'>Duration</h3>

				{disabled ? (
					<div className='w-5 h-5' />
				) : (
					<button
						data-testid='add-button'
						onClick={addDuration}
						className='hover:opacity-80 transition-opacity w-4'
					>
						<PlusCircleIcon className='w-5 h-5 transition-transform duration-300' />
					</button>
				)}
			</div>

			{durations.map((duration, index) => (
				<div key={duration.id} className='space-y-2'>
					<div className='grid grid-cols-1 sm:grid-cols-2 gap-2'>
						<div className='min-w-0'>
							<TimePicker
								id={`start-${index}`}
								label='Start'
								value={duration.startTime}
								onChange={(value) => {
									const updated = [...durations];
									updated[index].startTime = value;
									setDurations(updated);
								}}
								disabled={disabled}
							/>
						</div>
						<div className='min-w-0'>
							<TimePicker
								id={`end-${index}`}
								label='End'
								value={duration.endTime}
								onChange={(value) => {
									const updated = [...durations];
									updated[index].endTime = value;
									setDurations(updated);
								}}
								disabled={disabled}
							/>
						</div>
					</div>

					{durations.length > 1 && !disabled && (
						<button
							onClick={() => removeDuration(duration.id)}
							className='flex items-center gap-1 text-xs text-red-300 hover:opacity-80 transition-opacity'
						>
							<XMarkIcon className='h-3 w-3' /> Remove
						</button>
					)}
				</div>
			))}
		</div>
	);
}

export default Durations;
