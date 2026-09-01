import type { ButtonType } from '@/shared/constants/input/button';
import type { FeedbackType } from '@/shared/constants/button/feedback';
import { FEEDBACK_TYPES } from '@/shared/constants/button/feedback';

type ButtonVariant = 'primary' | 'secondary';

interface ISubmitButton {
	type: ButtonType;
	label: string;
	onClick?: () => void;
	disabled?: boolean;
	className?: string;
	variant?: ButtonVariant;
	feedback?: FeedbackType;
	loading?: boolean;
	loadingLabel?: string;
}

const feedbackClass = (feedback?: FeedbackType) => {
	if (feedback === FEEDBACK_TYPES.SUCCESS) return 'btn-feedback-success';
	if (feedback === FEEDBACK_TYPES.ERROR) return 'btn-feedback-error';
	return '';
};

function SubmitButton({
	type,
	label,
	onClick,
	disabled = false,
	className = '',
	variant = 'primary',
	feedback = null,
	loading = false,
	loadingLabel,
}: ISubmitButton) {
	const variantClass = variant === 'secondary' ? 'btn-secondary' : 'btn-primary';
	const displayLabel = loading && loadingLabel ? loadingLabel : label;

	return (
		<button
			type={type}
			onClick={onClick}
			disabled={disabled || loading}
			className={`${variantClass} ${feedbackClass(feedback)} disabled:opacity-40 ${className}`.trim()}
		>
			{displayLabel}
		</button>
	);
}

export default SubmitButton;
