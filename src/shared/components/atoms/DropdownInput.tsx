import { useClickOutside } from "@/shared/hooks/use-click-outside";
import type { DropdownOption } from "@/shared/types/input/input";
import { useRef, useState } from "react";

interface IDropdownInput {
    id: string;
    label: string;
    value: string;
    options: DropdownOption[];
    onChange: (value: string) => void;
    required?: boolean;
}

function DropdownInput({ id, label, value, options, onChange, required = false }: IDropdownInput) {
    const buttonRef = useRef<HTMLButtonElement>(null);
    const menuRef = useRef<HTMLUListElement>(null);

    const [open, setOpen] = useState(false);

    useClickOutside([buttonRef, menuRef], () => setOpen(false));

    const handleSelect = (value: string) => {
        onChange(value);
        setOpen(false);
    };

    return (
        <div className="relative w-full">
            <label htmlFor={id} className="block text-sm font-medium mb-1">{label}</label>

            <input type="text" id={id} value={value} required={required} className="hidden" readOnly />

            <button
                ref={buttonRef}
                type="button"
                className="w-full p-2 rounded-lg bg-black/10 backdrop-blur-sm border border-white/20 text-left"
                onClick={() => setOpen(prev => !prev)}
            >
                {options.find(option => option.value === value)?.label || "Select..."}
            </button>

            {open && (
                <ul ref={menuRef} className="absolute z-10 mt-1 w-full max-h-48 overflow-auto rounded-lg bg-black/30 backdrop-blur-md border border-white/20 text-white shadow-lg">
                    {options.map(option => (
                        <li
                            key={option.value}
                            className={`px-3 py-2 cursor-pointer ${option.value === value ? 'bg-white/20' : ''} hover:opacity-80 transition-opacity`}
                            onClick={() => handleSelect(option.value)}
                        >
                            {option.label}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default DropdownInput;
