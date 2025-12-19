interface IconSliderProps {
  value: number;
  min?: number;
  max?: number;
  step?: number;
  onChange: (value: number) => void;
}

export function IconSlider({ value, min = 16, max = 64, step = 1, onChange }: IconSliderProps) {
  const percentage = ((value - min) / (max - min)) * 100;

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <label htmlFor="size-slider" className="text-sm text-neutral-700">
          Size
        </label>
        <span className="text-sm text-neutral-500">{value}px</span>
      </div>
      <div className="relative flex items-center select-none touch-none w-full h-5">
        <div className="relative flex-1 h-1 bg-neutral-200 rounded-full">
          <div
            className="absolute h-full bg-neutral-900 rounded-full transition-all"
            style={{ width: `${percentage}%` }}
          />
        </div>
        <input
          id="size-slider"
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="absolute w-full h-full opacity-0 cursor-pointer"
          aria-label="Icon size"
        />
        <div
          className="block w-5 h-5 bg-white border-2 border-neutral-900 rounded-full hover:bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:ring-offset-2 cursor-pointer pointer-events-none"
          style={{ left: `${percentage}%`, transform: 'translateX(-50%)' }}
        />
      </div>
    </div>
  );
}
