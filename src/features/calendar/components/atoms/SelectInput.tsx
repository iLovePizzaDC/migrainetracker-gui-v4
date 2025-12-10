import { SELECT_TYPES, type SelectType } from "@/shared/constants/input/select";
import type { DropdownOption } from "@/shared/types";

interface ISelectInput {
    id: string;
    type: SelectType;
    label: string;
    options: DropdownOption[];
    value?: string | string[];
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    required?: boolean;
    disabled?: boolean;
}

function SelectInput({
    id,
    type,
    label,
    options,
    value,
    onChange,
    required = false,
    disabled = false,
}: ISelectInput) {
    return (
        <div className="space-y-1">
            {label && (
                <label htmlFor={id} className="block text-sm font-medium mb-1">
                    {label}
                </label>
            )}

            {options.map((option) => {
                const inputId = `${id}-${option.value}`;

                const isChecked =
                    type === SELECT_TYPES.RADIO
                        ? value === option.value
                        : Array.isArray(value) && value.includes(option.value);

                return (
                    <div key={option.value} className="flex items-center gap-2">
                        <input
                            id={inputId}
                            type={type}
                            value={option.value}
                            checked={isChecked}
                            onChange={onChange}
                            required={required}
                            className="h-4 w-4"
                            disabled={disabled}
                        />
                        <label htmlFor={inputId} className="text-sm w-full text-left">
                            {option.label}
                        </label>
                    </div>
                );
            })}
        </div>
    );
}

export default SelectInput;
