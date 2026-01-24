import type { DropdownOption } from "@/shared/types/input/input";

interface IDropdownInput {
    id: string;
    label: string;
    value: string;
    options: DropdownOption[];
    onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
    required?: boolean;
}

function DropdownInput({ id, label, value, options, onChange, required = false }: IDropdownInput) {

    return (
        <div>
            <label htmlFor={id} className="block text-sm font-medium mb-1">{label}</label>
            <select
                id={id}
                value={value}
                onChange={onChange}
                className="w-full p-2 rounded-lg bg-transparent backdrop-blur-sm border border-white/25"
                required={required}
            >
                {options.map((option: DropdownOption) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
        </div>
    );
}

export default DropdownInput;
