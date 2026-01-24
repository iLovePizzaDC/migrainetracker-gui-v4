interface IDatepicker {
    id: string;
    label: string;
    value: string;
    onChange: (value: string) => void;
    required?: boolean;
    disabled?: boolean;
}

function Datepicker({ id, label, value, onChange, required = false, disabled = false }: IDatepicker) {

    return (
        <div className="space-y-1">
            <label htmlFor={id} className="block text-sm font-medium">
                {label}
            </label>
            <input
                type="time"
                id={id}
                value={value}
                required={required}
                onChange={(e) => onChange(e.target.value)}
                className="w-full p-2 rounded border border-white/25 bg-transparent text-sm"
                disabled={disabled}
            />
        </div>
    );
}

export default Datepicker;
