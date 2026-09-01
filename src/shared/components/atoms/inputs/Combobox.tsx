import type { DropdownOption } from '@/shared/types/input';
import {
	ComboboxButton,
	ComboboxInput,
	ComboboxOption,
	ComboboxOptions,
	Combobox as UICombobox,
} from '@headlessui/react';
import { CheckIcon, XMarkIcon } from '@heroicons/react/24/outline';
import React, { useRef, useState, type ReactNode } from 'react';

interface ICombobox {
	id: string;
	options: DropdownOption[];
	selected: DropdownOption[];
	onChange: (value: DropdownOption[]) => void;
	label?: string;
	placeholder?: string;
	required?: boolean;
	disabled?: boolean;
	renderOptionActions?: (option: DropdownOption) => ReactNode;
	ref?: React.RefObject<HTMLDivElement | null>;
}

function Combobox({
	id,
	options,
	selected,
	onChange,
	label,
	placeholder = '',
	required = false,
	disabled = false,
	renderOptionActions,
	ref,
}: ICombobox) {
	const [query, setQuery] = useState('');
	const buttonRef = useRef<HTMLButtonElement | null>(null);
	const inputRef = useRef<HTMLInputElement | null>(null);

	const filtered =
		query === ''
			? options
			: options.filter(
					(option) =>
						option.label.toLowerCase().includes(query.toLowerCase()) ||
						option.value.toLowerCase().includes(query.toLowerCase()),
				);

	return (
		<div ref={ref} className='input-field w-full'>
			{label && (
				<label htmlFor={id} className='field-label'>
					{label}
				</label>
			)}

			<div className='flex flex-wrap gap-1 mb-1'>
				{selected.length === 0 ? (
					<div className='h-5' />
				) : (
					selected.map((option) => (
						<button
							key={option.value}
							type='button'
							className={`chip ${disabled ? '' : 'motion-fade hover:opacity-80'}`}
							onClick={() =>
								onChange(selected.filter((selectedOption) => selectedOption.value !== option.value))
							}
							disabled={disabled}
						>
							{option.label}
							{!disabled && (
								<span className='text-xs hover:text-red-300'>
									<XMarkIcon className='h-3 w-3' />
								</span>
							)}
						</button>
					))
				)}
			</div>

			{!disabled && (
				<UICombobox
					value={selected}
					onChange={(value) => {
						const last = value[value.length - 1];

						const isSelected = value.some(
							(optionValue, index) =>
								index !== value.length - 1 && optionValue.value === last.value,
						);

						const newValue = isSelected
							? value.filter((optionValue) => optionValue.value !== last.value)
							: value;

						onChange(newValue);
						setQuery('');

						buttonRef.current?.click();
						inputRef.current?.blur();
					}}
					multiple
				>
					<div className='relative mt-1'>
						<ComboboxButton ref={buttonRef} className='sr-only' type='button' />

						<ComboboxInput
							ref={inputRef}
							id={id}
							required={required}
							className='glass-input'
							onChange={(event) => setQuery(event.target.value)}
							displayValue={() => query}
							placeholder={placeholder}
							disabled={disabled}
						/>

						<ComboboxOptions className='glass-menu absolute z-50 mt-1 max-h-48 w-full overflow-auto'>
							{filtered.length === 0 && <div className='px-3 py-2 text-white/40'>No results</div>}

							{filtered.map((option) => {
								const active = selected.some((v) => v.value === option.value);
								return (
									<div
										key={option.value}
										className={`px-3 py-2 flex justify-between items-center cursor-pointer ${
											active ? 'bg-white/20' : ''
										}`}
									>
										<ComboboxOption
											as='span'
											value={option}
											className='flex-1 motion-fade hover:opacity-80'
										>
											{option.label}
										</ComboboxOption>

										{renderOptionActions?.(option)}

										{active && <CheckIcon className='h-4 w-4 ml-2' />}
									</div>
								);
							})}
						</ComboboxOptions>
					</div>
				</UICombobox>
			)}
		</div>
	);
}

export default Combobox;
