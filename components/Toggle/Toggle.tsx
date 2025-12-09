import React from 'react';
import './Toggle.css';

interface ToggleProps {
  label?: string;
  leftOption?: string;
  rightOption?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  variant?: 'classic' | 'button';
  className?: string;
}

const Toggle: React.FC<ToggleProps> = ({ label, leftOption, rightOption, checked, onChange, variant = 'classic', className = '' }) => {
  if (variant === 'button') {
    return (
      <button 
        className={`toggle-container button-variant ${className}`.trim()} 
        onClick={() => onChange(!checked)}
      >
        <div className={`toggle-highlight ${checked ? 'right' : 'left'}`} />
        <div className={`toggle-option ${!checked ? 'active' : ''}`}>
          {leftOption}
        </div>
        <div className={`toggle-option ${checked ? 'active' : ''}`}>
          {rightOption}
        </div>
      </button>
    );
  }

  return (
    <label className={`toggle-container classic-variant ${className}`.trim()}>
      <span className="toggle-label">{label}</span>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="toggle-input"
      />
      <span className="toggle-switch"></span>
    </label>
  );
};

export default Toggle;
