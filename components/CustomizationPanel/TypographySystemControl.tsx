import React, { useState, useEffect } from 'react';
import { useThemeCustomization } from '../../context/ThemeCustomizationContext';
import { useDesignSystem } from '../../context/DesignSystemContext';
import './TypographySystemControl.css';

/**
 * Typography System Control
 * Controls the modular scale system instead of individual font sizes
 */
export const TypographySystemControl: React.FC = () => {
  const { getCurrentTokenValue, setTokenValue } = useThemeCustomization();
  const { themeMode } = useDesignSystem();
  
  // Get current base font size (default: 1rem = 16px)
  const baseFontValue = getCurrentTokenValue('--font-size-base') || '1rem';
  const [baseFontSize, setBaseFontSize] = useState(parseFloat(baseFontValue));
  
  // Modular scale ratio (default: 1.333 = perfect fourth)
  const [scaleRatio, setScaleRatio] = useState(1.333);
  
  // Line height ratio (default: 1.5)
  const [lineHeight, setLineHeight] = useState(1.5);
  
  // Update local state when external values change
  useEffect(() => {
    setBaseFontSize(parseFloat(baseFontValue));
  }, [baseFontValue]);
  
  // Calculate all font sizes based on modular scale
  const calculateFontSizes = (base: number, ratio: number) => {
    return {
      // Body sizes
      '--font-size-body-xs': `${base * 0.75}rem`,      // 12px at 16px base
      '--font-size-body-sm': `${base * 0.875}rem`,     // 14px
      '--font-size-body-md': `${base}rem`,             // 16px (base)
      '--font-size-body-lg': `${base * 1.125}rem`,     // 18px
      
      // Heading sizes (modular scale)
      '--font-size-heading-xs': `${base}rem`,                          // base
      '--font-size-heading-sm': `${base * ratio}rem`,                  // base * ratio^1
      '--font-size-heading-md': `${base * Math.pow(ratio, 2)}rem`,     // base * ratio^2
      '--font-size-heading-lg': `${base * Math.pow(ratio, 3)}rem`,     // base * ratio^3
      '--font-size-heading-xl': `${base * Math.pow(ratio, 4)}rem`,     // base * ratio^4
      '--font-size-heading-2xl': `${base * Math.pow(ratio, 5)}rem`,    // base * ratio^5
    };
  };
  
  // Apply the typography system
  const applyTypographySystem = (base: number, ratio: number, lh: number) => {
    const fontSizes = calculateFontSizes(base, ratio);
    
    // Update base font size
    setTokenValue('--font-size-base', `${base}rem`, themeMode);
    
    // Update all calculated font sizes
    Object.entries(fontSizes).forEach(([token, value]) => {
      setTokenValue(token, value, themeMode);
    });
    
    // Update line heights
    setTokenValue('--line-height-tight', String(lh * 0.833), themeMode);   // 1.25 at 1.5 base
    setTokenValue('--line-height-normal', String(lh), themeMode);           // 1.5
    setTokenValue('--line-height-relaxed', String(lh * 1.167), themeMode);  // 1.75 at 1.5 base
  };
  
  const handleBaseFontChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    setBaseFontSize(value);
    applyTypographySystem(value, scaleRatio, lineHeight);
  };
  
  const handleScaleRatioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    setScaleRatio(value);
    applyTypographySystem(baseFontSize, value, lineHeight);
  };
  
  const handleLineHeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    setLineHeight(value);
    applyTypographySystem(baseFontSize, scaleRatio, value);
  };
  
  // Calculate preview values
  const previewSizes = calculateFontSizes(baseFontSize, scaleRatio);
  
  return (
    <div className="typography-system-control">
      <h4 className="typography-system-title">Typography System</h4>
      <p className="typography-system-description">
        Controls the modular scale that generates all font sizes
      </p>
      
      {/* Base Font Size */}
      <div className="typography-control-group">
        <label className="typography-label">
          <span className="typography-label-text">Base Font Size</span>
          <span className="typography-label-value">{baseFontSize.toFixed(3)}rem</span>
        </label>
        <input
          type="range"
          min="0.75"
          max="1.5"
          step="0.0625"
          value={baseFontSize}
          onChange={handleBaseFontChange}
          className="typography-slider"
        />
        <p className="typography-hint">Foundation size for all typography (typically 1rem = 16px)</p>
      </div>
      
      {/* Scale Ratio */}
      <div className="typography-control-group">
        <label className="typography-label">
          <span className="typography-label-text">Modular Scale Ratio</span>
          <span className="typography-label-value">{scaleRatio.toFixed(3)}</span>
        </label>
        <input
          type="range"
          min="1.067"
          max="1.618"
          step="0.001"
          value={scaleRatio}
          onChange={handleScaleRatioChange}
          className="typography-slider"
        />
        <div className="typography-scale-presets">
          <button onClick={() => { setScaleRatio(1.125); applyTypographySystem(baseFontSize, 1.125, lineHeight); }}>
            1.125 <small>(Major Second)</small>
          </button>
          <button onClick={() => { setScaleRatio(1.2); applyTypographySystem(baseFontSize, 1.2, lineHeight); }}>
            1.200 <small>(Minor Third)</small>
          </button>
          <button onClick={() => { setScaleRatio(1.25); applyTypographySystem(baseFontSize, 1.25, lineHeight); }}>
            1.250 <small>(Major Third)</small>
          </button>
          <button onClick={() => { setScaleRatio(1.333); applyTypographySystem(baseFontSize, 1.333, lineHeight); }}>
            1.333 <small>(Perfect Fourth)</small>
          </button>
          <button onClick={() => { setScaleRatio(1.414); applyTypographySystem(baseFontSize, 1.414, lineHeight); }}>
            1.414 <small>(Aug. Fourth)</small>
          </button>
          <button onClick={() => { setScaleRatio(1.5); applyTypographySystem(baseFontSize, 1.5, lineHeight); }}>
            1.500 <small>(Perfect Fifth)</small>
          </button>
          <button onClick={() => { setScaleRatio(1.618); applyTypographySystem(baseFontSize, 1.618, lineHeight); }}>
            1.618 <small>(Golden Ratio)</small>
          </button>
        </div>
        <p className="typography-hint">Multiplier for heading size progression</p>
      </div>
      
      {/* Line Height */}
      <div className="typography-control-group">
        <label className="typography-label">
          <span className="typography-label-text">Base Line Height</span>
          <span className="typography-label-value">{lineHeight.toFixed(2)}</span>
        </label>
        <input
          type="range"
          min="1.2"
          max="2.0"
          step="0.05"
          value={lineHeight}
          onChange={handleLineHeightChange}
          className="typography-slider"
        />
        <p className="typography-hint">Vertical rhythm (tight: {(lineHeight * 0.833).toFixed(2)}, normal: {lineHeight.toFixed(2)}, relaxed: {(lineHeight * 1.167).toFixed(2)})</p>
      </div>
      
      {/* Preview */}
      <div className="typography-preview">
        <h5 className="typography-preview-title">Preview</h5>
        <div className="typography-preview-grid">
          <div className="typography-preview-item">
            <span className="preview-label">H1 (2XL)</span>
            <span className="preview-value">{parseFloat(previewSizes['--font-size-heading-2xl']).toFixed(2)}rem</span>
          </div>
          <div className="typography-preview-item">
            <span className="preview-label">H2 (XL)</span>
            <span className="preview-value">{parseFloat(previewSizes['--font-size-heading-xl']).toFixed(2)}rem</span>
          </div>
          <div className="typography-preview-item">
            <span className="preview-label">H3 (LG)</span>
            <span className="preview-value">{parseFloat(previewSizes['--font-size-heading-lg']).toFixed(2)}rem</span>
          </div>
          <div className="typography-preview-item">
            <span className="preview-label">H4 (MD)</span>
            <span className="preview-value">{parseFloat(previewSizes['--font-size-heading-md']).toFixed(2)}rem</span>
          </div>
          <div className="typography-preview-item">
            <span className="preview-label">Body</span>
            <span className="preview-value">{parseFloat(previewSizes['--font-size-body-md']).toFixed(2)}rem</span>
          </div>
        </div>
      </div>
    </div>
  );
};

