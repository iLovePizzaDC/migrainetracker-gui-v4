import { INPUT_TYPES, type InputType } from '@/shared/constants/input/input';

interface ITextInput {
	id: string;
	label: string;
	type?: InputType;
	value: string;
	onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
	placeholder?: string;
	disabled?: boolean;
	required?: boolean;
}

function TextInput({
	id,
	label,
	type = INPUT_TYPES.TEXT,
	value,
	onChange,
	placeholder,
	disabled = false,
	required = false,
}: ITextInput) {
	return (
		<div className='input-field'>
			<label htmlFor={id} className='field-label'>
				{label}
			</label>
			<input
				id={id}
				type={type}
				value={value}
				onChange={onChange}
				className='glass-input'
				placeholder={placeholder}
				disabled={disabled}
				required={required}
			/>
		</div>
	);
}

export default TextInput;
