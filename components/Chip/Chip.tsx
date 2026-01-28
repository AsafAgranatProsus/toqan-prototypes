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
  
  /** Color priority/emphasis (affects bg, text, border together) */
  priority?: 'primary' | 'secondary' | 'tertiary' | 'neutral';
  
  /** Text/icon color - overrides priority for text only */
  color?: 'primary' | 'secondary' | 'tertiary' | 'neutral' | 'muted';
  
  /** Transparent background */
  transparent?: boolean;
  
  /** Show border (default: true for outlined, false for filled) */
  bordered?: boolean;
  
  /** Font weight override */
  weight?: 'regular' | 'medium' | 'semibold' | 'bold';
  
  /** Hover background style */
  hoverBg?: 'default' | 'subtle' | 'none';
  
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
  priority,
  color,
  transparent = false,
  bordered,
  weight,
  hoverBg,
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
    priority ? `chip--priority-${priority}` : '',
    color ? `chip--color-${color}` : '',
    transparent ? 'chip--transparent' : '',
    bordered === true ? 'chip--bordered' : '',
    bordered === false ? 'chip--no-border' : '',
    weight ? `chip--weight-${weight}` : '',
    hoverBg ? `chip--hover-${hoverBg}` : '',
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
