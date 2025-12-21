import './IconSlider.css';

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
    <div className="ds-icon-slider">
      <div className="ds-icon-slider-header">
        <label htmlFor="size-slider" className="ds-icon-slider-label">
          Size
        </label>
        <span className="ds-icon-slider-value">{value}px</span>
      </div>
      <div className="ds-slider-track">
        <div className="ds-slider-background" />
        <div
          className="ds-slider-fill"
          style={{ width: `${percentage}%` }}
        />
        <div
          className="ds-slider-thumb"
          style={{ left: `${percentage}%` }}
        />
        <input
          id="size-slider"
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="ds-slider-input"
          aria-label="Icon size"
        />
      </div>
    </div>
  );
}
