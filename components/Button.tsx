import React from 'react';
import { Icons } from './Icons';
import type { IconName } from '../types';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'tertiary';
  shape?: 'rounded' | 'circle';
  icon?: IconName;
  iconPosition?: 'left' | 'right';
  children?: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  shape = 'rounded',
  icon,
  iconPosition = 'left',
  children,
  className,
  ...props
}) => {
  const isIconOnly = icon && !children;

  const classNames = [
    'btn',
    `btn--${variant}`,
    `btn--${shape}`,
    isIconOnly ? 'btn--icon-only' : '',
    className
  ].filter(Boolean).join(' ');

  const iconComponent = icon ? <Icons name={icon} /> : null;

  return (
    <button className={classNames} {...props}>
      {iconPosition === 'left' && iconComponent}
      {children && <span>{children}</span>}
      {iconPosition === 'right' && iconComponent}
    </button>
  );
};

export default Button;
