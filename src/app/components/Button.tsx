import React from 'react';
import { Button as PrimerButton } from '@primer/react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  icon?: boolean;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
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
  // Map custom variants to Primer variants
  const primerVariant = variant === 'primary' ? 'primary' : 
                       variant === 'secondary' ? 'secondary' :
                       variant === 'ghost' ? 'invisible' :
                       'default';

  // Map sizes
  const primerSize = size === 'sm' ? 'small' : size === 'lg' ? 'large' : 'medium';

  return (
    <PrimerButton
      variant={primerVariant}
      size={primerSize}
      className={className}
      {...props}
    >
      {children}
    </PrimerButton>
  );
}
