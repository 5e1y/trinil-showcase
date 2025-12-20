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
      <div className="w-full">
        <div className="relative flex items-center h-5 select-none touch-none">
          {/* Track background */}
          <div className="absolute w-full h-1 bg-neutral-200 rounded-full pointer-events-none" />
          
          {/* Track filled */}
          <div
            className="absolute h-1 bg-neutral-900 rounded-full pointer-events-none transition-all"
            style={{ width: `${percentage}%` }}
          />
          
          {/* Thumb */}
          <div
            className="absolute w-5 h-5 bg-white border-2 border-neutral-900 rounded-full hover:bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:ring-offset-2 cursor-pointer pointer-events-none transition-all"
            style={{ left: `${percentage}%`, transform: 'translateX(-50%)' }}
          />
          
          {/* Hidden input range */}
          <input
            id="size-slider"
            type="range"
            min={min}
            max={max}
            step={step}
            value={value}
            onChange={(e) => onChange(Number(e.target.value))}
            className="absolute w-full h-full opacity-0 cursor-pointer z-10"
            aria-label="Icon size"
          />
        </div>
      </div>
    </div>
  );
}
