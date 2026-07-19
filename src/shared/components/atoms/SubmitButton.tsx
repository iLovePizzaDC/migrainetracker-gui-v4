import type { ButtonType } from '@/shared/constants/input/button';

interface ISubmitButton {
  type: ButtonType;
  label: string;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}

function SubmitButton({ type, label, onClick, disabled = false, className }: ISubmitButton) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
                px-4 py-2 rounded-lg backdrop-blur-xl border shadow-sm shadow-black/30 text-sm font-medium transition-opacity
                ${className}
                hover:opacity-80 disabled:opacity-80
            `}
    >
      {label}
    </button>
  );
}

export default SubmitButton;
