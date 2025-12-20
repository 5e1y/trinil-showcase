import { useEffect, useState } from 'react';

interface TooltipProps {
  iconName: string;
  x: number;
  y: number;
}

export function Tooltip({ iconName, x, y }: TooltipProps) {
  const [position, setPosition] = useState<{ x: number; y: number; placement: 'top' | 'bottom' }>({ 
    x, 
    y, 
    placement: 'top' 
  });

  useEffect(() => {
    // Adjust position to avoid clipping at viewport edges
    const tooltipWidth = 200; // approximate max width
    const tooltipHeight = 40; // approximate height
    const padding = 8;

    let adjustedX = x;
    let adjustedY = y - tooltipHeight - padding;
    let placement: 'top' | 'bottom' = 'top';

    // Check top edge - if not enough space, show below
    if (adjustedY < padding) {
      adjustedY = y + tooltipHeight + padding;
      placement = 'bottom';
    }

    // Check right edge
    if (adjustedX + tooltipWidth / 2 > window.innerWidth - padding) {
      adjustedX = window.innerWidth - tooltipWidth / 2 - padding;
    }

    // Check left edge
    if (adjustedX - tooltipWidth / 2 < padding) {
      adjustedX = tooltipWidth / 2 + padding;
    }

    setPosition({ x: adjustedX, y: adjustedY, placement });
  }, [x, y]);

  return (
    <div
      className="fixed z-50 pointer-events-none"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        transform: 'translateX(-50%)',
      }}
    >
      <div className="bg-neutral-900 text-white text-sm px-3 py-2 rounded-lg shadow-lg whitespace-nowrap">
        {iconName}
        {/* Arrow pointing up when tooltip is below the icon */}
        {position.placement === 'bottom' && (
          <div
            className="absolute w-2 h-2 bg-neutral-900 transform rotate-45"
            style={{
              left: '50%',
              top: '-4px',
              marginLeft: '-4px',
            }}
          />
        )}
        {/* Arrow pointing down when tooltip is above the icon */}
        {position.placement === 'top' && (
          <div
            className="absolute w-2 h-2 bg-neutral-900 transform rotate-45"
            style={{
              left: '50%',
              bottom: '-4px',
              marginLeft: '-4px',
            }}
          />
        )}
      </div>
    </div>
  );
}
