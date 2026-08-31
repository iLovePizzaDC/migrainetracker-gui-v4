interface ISlider {
	id: string;
	label: string;
	min: number;
	max: number;
	step?: number;
	value: number;
	onChange: (value: number) => void;
	disabled?: boolean;
}

function Slider({ id, label, min, max, step = 1, value, onChange, disabled = false }: ISlider) {
	return (
		<div className='space-y-2'>
			<div className='flex items-center justify-between'>
				<label htmlFor={id} className='field-label !mb-0'>
					{label}
				</label>
				<span className='text-xs font-medium tabular-nums text-white/50'>{value}</span>
			</div>
			<input
				type='range'
				id={id}
				min={min}
				max={max}
				step={step}
				value={value}
				onChange={(e) => onChange(Number(e.target.value))}
				disabled={disabled}
			/>
		</div>
	);
}

export default Slider;
