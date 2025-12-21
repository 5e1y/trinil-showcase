import { useState } from 'react';
import * as TrinilIcons from 'trinil-react';
import { Tooltip } from './Tooltip';
import './IconGrid.css';

interface IconGridProps {
  icons: string[];
  iconSize: number;
  selectedIcon: string | null;
  onSelectIcon: (iconName: string) => void;
  searchQuery: string;
}

export function IconGrid({
  icons,
  iconSize,
  selectedIcon,
  onSelectIcon,
  searchQuery,
}: IconGridProps) {
  const [hoveredIcon, setHoveredIcon] = useState<string | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState<{ x: number; top: number; bottom: number } | null>(null);

  const handleMouseEnter = (iconName: string, e: React.MouseEvent | React.FocusEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setHoveredIcon(iconName);
    setTooltipPosition({
      x: rect.left + rect.width / 2,
      top: rect.top - 8,
      bottom: rect.bottom + 8,
    });
  };

  const handleMouseLeave = () => {
    setHoveredIcon(null);
    setTooltipPosition(null);
  };

  return (
    <div className="ds-icon-grid">
      {/* Results count */}
      {searchQuery && (
        <div className="ds-icon-grid-count">
          {icons.length} icon{icons.length !== 1 ? 's' : ''} found
        </div>
      )}

      {/* Simple flex grid */}
      <div className="ds-icon-grid-items">
        {icons.map((iconName) => {
          const IconComponent = TrinilIcons[iconName as keyof typeof TrinilIcons] as React.ComponentType<{
            size?: number;
            color?: string;
            className?: string;
          }>;

          const isSelected = selectedIcon === iconName;

          return (
            <button
              key={iconName}
              onClick={() => onSelectIcon(iconName)}
              onMouseEnter={(e) => handleMouseEnter(iconName, e)}
              onMouseLeave={handleMouseLeave}
              onFocus={(e) => handleMouseEnter(iconName, e)}
              onBlur={handleMouseLeave}
              className={`ds-icon-button ${isSelected ? 'selected' : ''}`}
              aria-label={iconName}
            >
              {IconComponent && <IconComponent size={iconSize} color="var(--ds-color-text)" />}
            </button>
          );
        })}
      </div>

      {/* Tooltip - always show on hover */}
      {hoveredIcon && tooltipPosition && (
        <Tooltip iconName={hoveredIcon} x={tooltipPosition.x} top={tooltipPosition.top} bottom={tooltipPosition.bottom} />
      )}

      {/* No results */}
      {icons.length === 0 && (
        <div className="ds-icon-grid-empty">
          No icons found for "{searchQuery}"
        </div>
      )}
    </div>
  );
}