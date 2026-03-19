import {
	PICKER_HOURS,
	PICKER_MINUTES,
	SECTION_PADDING,
} from '@/features/calendar/constants/time-picker';
import { useScrollSnapPicker } from '@/features/calendar/hooks/use-scroll-snap-picker';
import { normalizeTime } from '@/features/calendar/utils/scroll-snap-helper';
import { useClickOutside } from '@/shared/hooks/use-click-outside';
import { useState } from 'react';

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
	const [open, setOpen] = useState(false);
	const [selectedHour = '12', selectedMinute = '00'] = value.split(':');

	const { inputRef, pickerRef, hourRef, minuteRef, scrollToIndex, handleScroll } =
		useScrollSnapPicker(open, selectedHour, selectedMinute);

	useClickOutside([inputRef, pickerRef], () => setOpen(false));

	return (
		<div className='relative w-full space-y-1'>
			<label
				htmlFor={id}
				className='block text-sm font-medium cursor-pointer'
				onClick={() => inputRef.current?.focus()}
			>
				{label}
			</label>

			<input
				ref={inputRef}
				id={id}
				type='text'
				inputMode='numeric'
				placeholder='HH:mm'
				value={value}
				required={required}
				disabled={disabled}
				onFocus={() => setOpen(true)}
				onChange={(e) => onChange(normalizeTime(e.target.value))}
				className='w-full p-2 rounded-lg bg-black/10 border border-white/20 text-white text-sm'
			/>

			{open && (
				<div
					ref={pickerRef}
					className='absolute z-20 w-full mt-1 flex rounded-lg bg-black/30 border border-white/20 p-3'
					data-testid='picker-popup'
				>
					<div
						ref={hourRef}
						className='h-[160px] w-1/2 overflow-y-scroll scrollbar-none'
						style={{ paddingTop: SECTION_PADDING, paddingBottom: SECTION_PADDING }}
						onScroll={(e) =>
							handleScroll(e, PICKER_HOURS, (h) => onChange(`${h}:${selectedMinute}`))
						}
					>
						{PICKER_HOURS.map((hour, index) => (
							<div
								key={hour}
								onClick={() => {
									scrollToIndex(hourRef, index);
									onChange(`${hour}:${selectedMinute}`);
								}}
								className={`h-8 flex items-center justify-center cursor-pointer ${
									hour === selectedHour ? 'text-white font-medium' : 'text-white/40'
								}`}
							>
								{hour}
							</div>
						))}
					</div>

					<div
						ref={minuteRef}
						className='h-[160px] w-1/2 overflow-y-scroll scrollbar-none'
						style={{ paddingTop: SECTION_PADDING, paddingBottom: SECTION_PADDING }}
						onScroll={(e) =>
							handleScroll(e, PICKER_MINUTES, (m) => onChange(`${selectedHour}:${m}`))
						}
					>
						{PICKER_MINUTES.map((minute, index) => (
							<div
								key={minute}
								onClick={() => {
									scrollToIndex(minuteRef, index);
									onChange(`${selectedHour}:${minute}`);
								}}
								className={`h-8 flex items-center justify-center cursor-pointer ${
									minute === selectedMinute ? 'text-white font-medium' : 'text-white/40'
								}`}
							>
								{minute}
							</div>
						))}
					</div>

					<div className='pointer-events-none absolute inset-x-3 top-1/2 h-8 -translate-y-1/2 border-y border-white/30' />
				</div>
			)}
		</div>
	);
}

export default TimePicker;
