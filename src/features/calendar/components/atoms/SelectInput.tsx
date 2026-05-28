import { SELECT_TYPES, type SelectType } from '@/shared/constants/input/select';
import type { DropdownOption } from '@/shared/types/input/input';

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
		<div data-testid='select-input' className='space-y-1'>
			{label && <label className='block text-sm font-medium mb-1'>{label}</label>}

			{options.map((option) => {
				const inputId = `${id}-${option.value}`;

				const isChecked =
					type === SELECT_TYPES.RADIO
						? value === option.value
						: Array.isArray(value) && value.includes(option.value);

				return (
					<div key={option.value} className='flex items-center gap-3 cursor-pointer'>
						<input
							id={inputId}
							type={type}
							value={option.value}
							checked={isChecked}
							onChange={onChange}
							required={required}
							className='h-4 w-4 shrink-0'
							disabled={disabled}
						/>
						<label htmlFor={inputId} className='text-sm w-full text-left py-1 cursor-pointer'>
							{option.label}
						</label>
					</div>
				);
			})}
		</div>
	);
}

export default SelectInput;
