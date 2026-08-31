import type { ButtonType } from '@/shared/constants/input/button';

type ButtonVariant = 'primary' | 'secondary';

interface ISubmitButton {
	type: ButtonType;
	label: string;
	onClick?: () => void;
	disabled?: boolean;
	className?: string;
	variant?: ButtonVariant;
}

function SubmitButton({
	type,
	label,
	onClick,
	disabled = false,
	className = '',
	variant = 'primary',
}: ISubmitButton) {
	const variantClass = variant === 'secondary' ? 'btn-secondary' : 'btn-primary';

	return (
		<button
			type={type}
			onClick={onClick}
			disabled={disabled}
			className={`${variantClass} disabled:opacity-40 ${className}`.trim()}
		>
			{label}
		</button>
	);
}

export default SubmitButton;
