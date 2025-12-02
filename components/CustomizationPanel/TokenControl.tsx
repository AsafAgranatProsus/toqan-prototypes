import React, { useState, useEffect } from 'react';
import { ColorPicker } from './ColorPicker';
import { type TokenMetadata } from '../../themes/tokenMetadata';
import { useThemeCustomization } from '../../context/ThemeCustomizationContext';
import { useDesignSystem } from '../../context/DesignSystemContext';
import './TokenControl.css';

export interface TokenControlProps {
  token: TokenMetadata;
}

/**
 * Smart control component that renders the appropriate input based on token type
 */
export const TokenControl: React.FC<TokenControlProps> = ({ token }) => {
  const { getCurrentTokenValue, setTokenValue } = useThemeCustomization();
  const { themeMode } = useDesignSystem();
  
  const currentValue = getCurrentTokenValue(token.name) || '';
  const [localValue, setLocalValue] = useState(currentValue);
  
  // Update local value when external value changes
  useEffect(() => {
    setLocalValue(currentValue);
  }, [currentValue]);
  
  const handleChange = (newValue: string) => {
    setLocalValue(newValue);
    setTokenValue(token.name, newValue, themeMode);
  };
  
  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setLocalValue(newValue);
  };
  
  const handleTextBlur = () => {
    setTokenValue(token.name, localValue, themeMode);
  };
  
  const handleTextKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleTextBlur();
    }
  };
  
  // Render color picker for color tokens
  if (token.type === 'color') {
    return (
      <div className="token-control">
        <div className="token-control-header">
          <label className="token-control-label">{token.displayName}</label>
          <p className="token-control-description">{token.description}</p>

        </div>
        <ColorPicker value={currentValue} onChange={handleChange} />
        {token.description && (
          <code className="token-control-name">{token.name}</code>
        )}
      </div>
    );
  }
  
  // Render slider for slider types
  if (token.type === 'slider-0-1' || token.type === 'slider-0-100') {
    const min = token.type === 'slider-0-1' ? 0 : 0;
    const max = token.type === 'slider-0-1' ? 1 : 100;
    const step = token.type === 'slider-0-1' ? 0.01 : 1;
    
    // Parse current value as number
    const numValue = parseFloat(localValue) || 0;
    
    const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      handleChange(newValue);
    };
    
    const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      setLocalValue(newValue);
    };
    
    const handleNumberBlur = () => {
      let num = parseFloat(localValue);
      if (isNaN(num)) num = 0;
      num = Math.max(min, Math.min(max, num));
      const finalValue = num.toString();
      setLocalValue(finalValue);
      setTokenValue(token.name, finalValue, themeMode);
    };
    
    return (
      <div className="token-control">
        <div className="token-control-header">
          <label className="token-control-label">{token.displayName}</label>
          <code className="token-control-name">{token.name}</code>
        </div>
        <div className="token-control-slider-group">
          <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={numValue}
            onChange={handleSliderChange}
            className="token-control-slider"
          />
          <input
            type="number"
            min={min}
            max={max}
            step={step}
            value={localValue}
            onChange={handleNumberChange}
            onBlur={handleNumberBlur}
            onKeyDown={handleTextKeyDown}
            className="token-control-number"
          />
        </div>
        {token.description && (
          <p className="token-control-description">{token.description}</p>
        )}
      </div>
    );
  }
  
  // Render text input for strings, shadows, dimensions
  return (
    <div className="token-control">
      <div className="token-control-header">
        <label className="token-control-label">{token.displayName}</label>
        <code className="token-control-name">{token.name}</code>
      </div>
      <input
        type="text"
        value={localValue}
        onChange={handleTextChange}
        onBlur={handleTextBlur}
        onKeyDown={handleTextKeyDown}
        className="token-control-text"
        placeholder={`e.g., ${currentValue}`}
      />
      {token.description && (
        <p className="token-control-description">{token.description}</p>
      )}
    </div>
  );
};

