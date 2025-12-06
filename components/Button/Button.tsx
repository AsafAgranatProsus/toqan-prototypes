import React from 'react';
import { Icons } from '../Icons/Icons';
import type { IconName } from '../../types';
import './Button.css';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'tertiary' | 'outline' | 'icon' | 'filled' | 'tonal' | 'outlined' | 'text';
  shape?: 'rounded' | 'circle';
  size?: 'sm' | 'md' | 'lg';
  icon?: IconName;
  iconPosition?: 'left' | 'right';
  children?: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  shape,
  size = 'md',
  icon,
  iconPosition = 'left',
  children,
  className,
  ...props
}) => {
  const isIconOnly = icon && !children;
  
  // Icon variant is round by default, but shape can override
  const buttonShape = shape || (variant === 'icon' ? 'circle' : 'rounded');

  const classNames = [
    'btn',
    `btn--${variant}`,
    `btn--${buttonShape}`,
    size !== 'md' ? `btn--${size}` : '',
    isIconOnly ? 'btn--icon-only' : '',
    className
  ].filter(Boolean).join(' ');

  const iconComponent = icon ? <Icons name={icon} /> : null;

  return (
    <button className={classNames} {...props}>
      {iconPosition === 'left' && iconComponent}
      {children && <span className="btn__children">{children}</span>}
      {iconPosition === 'right' && iconComponent}
    </button>
  );
};

export default Button;
