import { useState } from 'react';
import * as TrinilIcons from 'trinil-react';
import { Tooltip } from './Tooltip';
import { Button } from './Button';

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
    <div className="flex-1 overflow-auto p-6 bg-[var(--ds-color-surface-muted)]">
      {/* Results count */}
      {searchQuery && (
        <div className="mb-4 text-sm text-[var(--ds-color-text-subtle)]">
          {icons.length} icon{icons.length !== 1 ? 's' : ''} found
        </div>
      )}

      {/* Simple flex grid */}
      <div className="flex flex-wrap gap-3">
        {icons.map((iconName) => {
          const IconComponent = TrinilIcons[iconName as keyof typeof TrinilIcons] as React.ComponentType<{
            size?: number;
            color?: string;
            className?: string;
          }>;

          const isSelected = selectedIcon === iconName;

          return (
            <Button
              key={iconName}
              onClick={() => onSelectIcon(iconName)}
              onMouseEnter={(e) => handleMouseEnter(iconName, e)}
              onMouseLeave={handleMouseLeave}
              onFocus={(e) => handleMouseEnter(iconName, e)}
              onBlur={handleMouseLeave}
              variant="secondary"
              className={`!w-auto !h-auto aspect-square flex-grow min-w-[72px] min-h-[72px] max-w-[96px] max-h-[96px] p-3 rounded-[var(--ds-radius-lg)] ${isSelected ? 'ring-2 ring-[var(--ds-color-primary)] ring-offset-2 ring-offset-[var(--ds-color-surface-muted)]' : ''}`}
              aria-label={iconName}
            >
              {IconComponent && <IconComponent size={iconSize} color="var(--ds-color-text)" />}
            </Button>
          );
        })}
      </div>

      {/* Tooltip - always show on hover */}
      {hoveredIcon && tooltipPosition && (
        <Tooltip iconName={hoveredIcon} x={tooltipPosition.x} top={tooltipPosition.top} bottom={tooltipPosition.bottom} />
      )}

      {/* No results */}
      {icons.length === 0 && (
        <div className="flex items-center justify-center h-64 text-[var(--ds-color-text-muted)]">
          No icons found for "{searchQuery}"
        </div>
      )}
    </div>
  );
}