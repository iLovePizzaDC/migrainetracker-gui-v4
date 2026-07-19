interface ISlider {
  id: string;
  label: string;
  min: number;
  max: number;
  step?: number;
  value: number;
  onChange: (value: number) => void;
  disabled?: boolean;
}

function Slider({ id, label, min, max, step = 1, value, onChange, disabled = false }: ISlider) {
  return (
    <div className='space-y-1'>
      <label htmlFor={id} className='block text-sm font-medium'>
        {label}: {value}
      </label>
      <input
        type='range'
        id={id}
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className='w-full'
        disabled={disabled}
      />
    </div>
  );
}

export default Slider;
