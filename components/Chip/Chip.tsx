import React from 'react';
import { Icons } from '../Icons/Icons';
import type { IconName } from '../../types';
import './Chip.css';

export interface ChipProps {
  children: React.ReactNode;
  
  /** Click handler */
  onClick?: () => void;
  
  /** Optional icon before text */
  icon?: IconName;
  
  /** Chip style variant */
  variant?: 'default' | 'outlined' | 'filled';
  
  /** Size variant */
  size?: 'sm' | 'md' | 'lg';
  
  /** Disabled state */
  disabled?: boolean;
  
  /** Selected/active state */
  selected?: boolean;
  
  /** Additional class name */
  className?: string;
}

export const Chip: React.FC<ChipProps> = ({
  children,
  onClick,
  icon,
  variant = 'outlined',
  size = 'md',
  disabled = false,
  selected = false,
  className,
}) => {
  const isClickable = !!onClick && !disabled;
  
  const chipClasses = [
    'chip',
    `chip--${variant}`,
    `chip--${size}`,
    isClickable ? 'chip--clickable' : '',
    disabled ? 'chip--disabled' : '',
    selected ? 'chip--selected' : '',
    className,
  ].filter(Boolean).join(' ');

  const Component = isClickable ? 'button' : 'span';
  
  return (
    <Component
      className={chipClasses}
      onClick={isClickable ? onClick : undefined}
      disabled={disabled}
      type={isClickable ? 'button' : undefined}
    >
      {icon && <Icons name={icon} className="chip__icon" />}
      <span className="chip__label">{children}</span>
    </Component>
  );
};

export default Chip;
