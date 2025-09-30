import React from 'react';

interface TagProps extends React.HTMLAttributes<HTMLSpanElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'beta';
  size?: 'sm' | 'md';
  className?: string;
}

const Tag: React.FC<TagProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  className,
  ...props
}) => {
  const classNames = [
    'tag',
    `tag--${variant}`,
    `tag--${size}`,
    className,
  ].filter(Boolean).join(' ');

  return (
    <span className={classNames} {...props}>
      {children}
    </span>
  );
};

export default Tag;
