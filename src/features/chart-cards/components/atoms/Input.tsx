import type { InputType } from '@/shared/constants/input/input';

interface IInput {
	id: string;
	label: string;
	type: InputType;
	value: string;
	onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
	placeholder?: string;
	required?: boolean;
}

function Input({ id, label, type, value, onChange, placeholder, required = false }: IInput) {
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
				required={required}
			/>
		</div>
	);
}

export default Input;
