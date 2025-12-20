import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  icon?: boolean; // Square button for icons
  variant?: 'outline' | 'primary'; // Button style
}

export function Button({ 
  children, 
  icon = false,
  variant = 'outline',
  className = '',
  ...props 
}: ButtonProps) {
  const baseStyles = 'flex items-center justify-center border rounded-lg transition-colors text-sm gap-2';
  
  const variantStyles = variant === 'primary' 
    ? 'bg-neutral-900 text-white border-neutral-900 hover:bg-neutral-800'
    : 'border-neutral-300 hover:bg-neutral-50';
  
  const sizeStyles = icon ? 'w-10 h-10' : 'w-full h-10 px-3';
  
  return (
    <button
      className={`${baseStyles} ${variantStyles} ${sizeStyles} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
