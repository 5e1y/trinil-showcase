import React from 'react';
import './Button.css';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  icon?: boolean;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
}

export function Button({ 
  children, 
  icon = false,
  variant = 'outline',
  size = 'md',
  className = '',
  ...props 
}: ButtonProps) {
  const baseClass = 'ds-button';
  const variantClass = variant === 'primary' ? 'primary' : variant === 'secondary' ? 'secondary' : 'outline';
  const sizeClass = size === 'sm' ? 'sm' : size === 'lg' ? 'lg' : 'md';
  const iconClass = icon ? 'icon' : '';

  return (
    <button
      className={`${baseClass} ${variantClass} ${sizeClass} ${iconClass} ${className}`}
    >
      {children}
    </button>
  );
}
