import type { DropdownOption } from "@/shared/types/input/input";
import {
    ComboboxButton,
    ComboboxInput,
    ComboboxOption,
    ComboboxOptions,
    Combobox as UICombobox,
} from "@headlessui/react";
import { CheckIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { useRef, useState } from "react";

interface ICombobox {
    id: string;
    label: string;
    options: DropdownOption[];
    selected: DropdownOption[];
    onChange: (value: DropdownOption[]) => void;
    placeholder?: string;
    required?: boolean;
    disabled?: boolean;
}

function Combobox({
    id,
    label,
    options,
    selected,
    onChange,
    placeholder = '',
    required = false,
    disabled = false,
}: ICombobox) {
    const [query, setQuery] = useState("");
    const buttonRef = useRef<HTMLButtonElement | null>(null);
    const inputRef = useRef<HTMLInputElement | null>(null);

    const filtered =
        query === ""
            ? options
            : options.filter((option) =>
                  (option.label.toLowerCase().includes(query.toLowerCase()) ||
                    option.value.toLowerCase().includes(query.toLowerCase()))
              );

    return (
        <div className="w-full">
            <label htmlFor={id} className="block text-sm font-medium mb-1">
                {label}
            </label>

            <div className="flex flex-wrap gap-1 mb-1">
                {selected.map((option) => (
                    <button
                        key={option.value}
                        type="button"
                        className={`px-2 py-0.5 bg-purple-700/50 rounded text-xs flex items-center gap-1 ${disabled ? '' : 'hover:opacity-80 transition-opacity'}`}
                        onClick={() =>
                            onChange(selected.filter((selectedOption) => selectedOption.value !== option.value))
                        }
                        disabled={disabled}
                    >
                        {option.label}
                        {!disabled &&
                            <span
                                className="text-xs hover:text-red-300"
                            >
                                <XMarkIcon className="h-3 w-3" />
                            </span>
                        }
                    </button>
                ))}
            </div>

            {!disabled &&
                <UICombobox
                    value={selected}
                    onChange={(value) => {
                        const last = value[value.length - 1];

                        const isSelected = value.some((optionValue, index) =>
                            index !== value.length - 1 && optionValue.value === last.value
                        );

                        const newValue = isSelected
                            ? value.filter(optionValue => optionValue.value !== last.value)
                            : value;

                        onChange(newValue);
                        setQuery("");

                        buttonRef.current?.click();
                        inputRef.current?.blur();
                    }}
                    multiple
                >
                    <div className="relative mt-1">
                        <ComboboxButton ref={buttonRef} className="sr-only" type="button" />

                        <ComboboxInput
                            ref={inputRef}
                            id={id}
                            required={required}
                            className="w-full p-2 rounded-lg bg-black/10 backdrop-blur-sm border border-white/5"
                            onChange={(event) => setQuery(event.target.value)}
                            displayValue={() => query}
                            placeholder={placeholder}
                            disabled={disabled}
                        />


                        <ComboboxOptions className="absolute z-50 mt-1 w-full max-h-48 overflow-auto rounded-lg bg-black/30 backdrop-blur-md border border-white/20 text-white shadow-lg">
                            {filtered.length === 0 && (
                                <div className="px-3 py-2 text-gray-400">No results</div>
                            )}

                            {filtered.map((option) => {
                                const active = selected.some((v) => v.value === option.value);
                                return (
                                    <ComboboxOption
                                        key={option.value}
                                        value={option}
                                        className={({ active }) =>
                                            `px-3 py-2 cursor-pointer flex justify-between ${
                                                active ? "bg-white/20" : ""
                                            }`
                                        }
                                    >
                                        <span>{option.label}</span>
                                        {active && <span className="my-auto"><CheckIcon className="h-4 w-4" /> </span>}
                                    </ComboboxOption>
                                );
                            })}
                        </ComboboxOptions>
                    </div>
                </UICombobox>
            }
        </div>
    );
}

export default Combobox;
