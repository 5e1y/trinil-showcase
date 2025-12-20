import { useEffect, useState } from 'react';

interface TooltipProps {
  iconName: string;
  x: number;
  top: number;
  bottom: number;
}

export function Tooltip({ iconName, x, top, bottom }: TooltipProps) {
  const calculatePosition = () => {
    const tooltipWidth = 200;
    const tooltipHeight = 40;
    const gap = 4;

    let adjustedX = x;
    let adjustedY = top - tooltipHeight - gap;
    let placement: 'top' | 'bottom' = 'top';

    if (adjustedY < 8) {
      adjustedY = bottom + gap;
      placement = 'bottom';
    }

    if (adjustedX + tooltipWidth / 2 > window.innerWidth - 8) {
      adjustedX = window.innerWidth - tooltipWidth / 2 - 8;
    }

    if (adjustedX - tooltipWidth / 2 < 8) {
      adjustedX = tooltipWidth / 2 + 8;
    }

    return { x: adjustedX, y: adjustedY, placement };
  };

  const [position, setPosition] = useState(() => calculatePosition());

  useEffect(() => {
    setPosition(calculatePosition());
  }, [x, top, bottom]);

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
