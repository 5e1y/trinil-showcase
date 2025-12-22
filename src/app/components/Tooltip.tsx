import React, { useEffect, useState } from 'react';

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
      <div
        style={{
          backgroundColor: 'var(--bgColor-neutral-emphasis)',
          color: 'var(--fgColor-onEmphasis)',
          fontSize: 'var(--fontSize-small)',
          padding: '6px 10px',
          borderRadius: 'var(--borderRadius-medium)',
          boxShadow: 'none',
          whiteSpace: 'nowrap',
          position: 'relative',
        }}
      >
        {iconName}
        {position.placement === 'bottom' && (
          <div
            style={{
              position: 'absolute',
              width: '8px',
              height: '8px',
              backgroundColor: 'var(--bgColor-neutral-emphasis)',
              transform: 'rotate(45deg)',
              left: '50%',
              top: '-4px',
              marginLeft: '-4px',
            }}
          />
        )}
        {position.placement === 'top' && (
          <div
            style={{
              position: 'absolute',
              width: '8px',
              height: '8px',
              backgroundColor: 'var(--bgColor-neutral-emphasis)',
              transform: 'rotate(45deg)',
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
