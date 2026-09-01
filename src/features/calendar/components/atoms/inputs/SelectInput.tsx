import { SELECT_TYPES, type SelectType } from '@/shared/constants/input/select';
import type { DropdownOption } from '@/shared/types/input';

interface ISelectInput {
	id: string;
	type: SelectType;
	options: DropdownOption[];
	onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
	label?: string;
	value?: string | string[];
	required?: boolean;
	disabled?: boolean;
}

function SelectInput({
	id,
	type,
	options,
	onChange,
	label,
	value,
	required = false,
	disabled = false,
}: ISelectInput) {
	return (
		<div data-testid='select-input' className='space-y-0.5'>
			{label && <label className='field-label'>{label}</label>}

			{options.map((option) => {
				const inputId = `${id}-${option.value}`;

				const isChecked =
					type === SELECT_TYPES.RADIO
						? value === option.value
						: Array.isArray(value) && value.includes(option.value);

				return (
					<label
						key={option.value}
						htmlFor={inputId}
						className={`flex cursor-pointer items-center gap-3 rounded-lg px-2 py-2 transition-colors ${
							isChecked ? 'bg-white/[0.06]' : 'hover:bg-white/[0.04]'
						} ${disabled ? 'is-disabled' : ''}`}
					>
						<input
							id={inputId}
							type={type}
							value={option.value}
							checked={isChecked}
							onChange={onChange}
							required={required}
							disabled={disabled}
						/>
						<span className='w-full text-left text-sm text-white/80'>{option.label}</span>
					</label>
				);
			})}
		</div>
	);
}

export default SelectInput;
