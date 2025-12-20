import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  icon?: boolean; // Square button for icons
  variant?: 'primary' | 'secondary' | 'outline'; // Button style
  size?: 'sm' | 'md' | 'lg'; // Button size
}

export function Button({ 
  children, 
  icon = false,
  variant = 'outline',
  size = 'md',
  className = '',
  ...props 
}: ButtonProps) {
  // Base styles consistent across all variants
  const baseStyles = 'flex items-center justify-center rounded-lg transition-colors text-sm gap-2 font-medium outline-none focus:outline-none';
  
  // Variant styles - only color/background changes
  const variantStyles = variant === 'primary' 
    ? 'bg-neutral-900 text-white hover:bg-neutral-800 active:bg-neutral-950'
    : variant === 'secondary'
    ? 'text-neutral-900 hover:bg-neutral-100 active:bg-neutral-200'
    : 'border border-neutral-300 text-neutral-900 hover:bg-neutral-50 active:bg-neutral-100';
  
  // Size styles
  const sizeStyles = icon 
    ? 'w-10 h-10 p-0' 
    : size === 'sm'
    ? 'h-8 px-3 py-1.5'
    : size === 'lg'
    ? 'h-11 px-5 py-2.5'
    : 'h-10 px-4 py-2';
  
  return (
    <button
      className={`${baseStyles} ${variantStyles} ${sizeStyles} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
