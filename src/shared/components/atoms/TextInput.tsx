interface ITextInput {
    id: string;
    label: string;
    value: string;
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    placeholder?: string;
    required?: boolean;
}

function TextInput({ id, label, value, onChange, placeholder, required }: ITextInput) {

    return (
        <div>
            <label htmlFor={id} className="block text-sm font-medium mb-1">{label}</label>
            <input
                id={id}
                value={value}
                onChange={onChange}
                className="w-full p-2 rounded-lg bg-transparent backdrop-blur-sm border border-white/25"
                placeholder={placeholder}
                required={required}
            />
        </div>
    );
}

export default TextInput;
