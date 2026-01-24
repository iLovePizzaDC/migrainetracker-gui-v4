import type { InputType } from "@/shared/constants/input/input";

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
        <div>
            <label htmlFor={id} className="block text-sm font-medium mb-1">{label}</label>
            <input
                id={id}
                type={type}
                value={value}
                onChange={onChange}
                className="w-full p-2 rounded-lg bg-transparent backdrop-blur-sm border border-white/25"
                placeholder={placeholder}
                required={required}
            />
        </div>
    );
}

export default Input;
