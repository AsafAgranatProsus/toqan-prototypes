import React, { useState, useEffect, useCallback, useRef } from 'react';
import { getHctFromHex, hexFromHct } from '../../themes/m3';
import './HctColorPicker.css';

export interface HctColorPickerProps {
  color: string;
  onApply: (color: string) => void;
  onCancel: () => void;
}

// Debounce hook for smooth slider updates
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}

export const HctColorPicker: React.FC<HctColorPickerProps> = ({
  color,
  onApply,
  onCancel,
}) => {
  // Parse initial HCT values from hex
  const initialHct = getHctFromHex(color);
  
  const [hue, setHue] = useState(initialHct.hue);
  const [chroma, setChroma] = useState(initialHct.chroma);
  const [tone, setTone] = useState(initialHct.tone);
  const [hexValue, setHexValue] = useState(color.toUpperCase());
  
  // Track if we're updating from hex input
  const isUpdatingFromHex = useRef(false);
  
  // Compute the current color from HCT values
  const currentColor = hexFromHct(hue, chroma, tone);
  
  // Update hex display when HCT changes (but not when updating from hex input)
  useEffect(() => {
    if (!isUpdatingFromHex.current) {
      setHexValue(currentColor.toUpperCase());
    }
    isUpdatingFromHex.current = false;
  }, [currentColor]);
  
  // Handle hex input change
  const handleHexChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.toUpperCase();
    
    // Ensure it starts with #
    if (!value.startsWith('#')) {
      value = '#' + value;
    }
    
    setHexValue(value);
    
    // Only parse if valid hex
    if (/^#[0-9A-F]{6}$/i.test(value)) {
      isUpdatingFromHex.current = true;
      const hct = getHctFromHex(value);
      setHue(hct.hue);
      setChroma(hct.chroma);
      setTone(hct.tone);
    }
  }, []);
  
  // Handle hex input blur - validate and correct
  const handleHexBlur = useCallback(() => {
    if (!/^#[0-9A-F]{6}$/i.test(hexValue)) {
      setHexValue(currentColor.toUpperCase());
    }
  }, [hexValue, currentColor]);
  
  // Handle keyboard events
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onCancel();
      } else if (e.key === 'Enter') {
        onApply(currentColor);
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onCancel, onApply, currentColor]);
  
  // Generate hue gradient background
  const hueGradient = `linear-gradient(to right, 
    ${hexFromHct(0, Math.max(chroma, 30), 50)},
    ${hexFromHct(60, Math.max(chroma, 30), 50)},
    ${hexFromHct(120, Math.max(chroma, 30), 50)},
    ${hexFromHct(180, Math.max(chroma, 30), 50)},
    ${hexFromHct(240, Math.max(chroma, 30), 50)},
    ${hexFromHct(300, Math.max(chroma, 30), 50)},
    ${hexFromHct(360, Math.max(chroma, 30), 50)}
  )`;
  
  // Generate chroma gradient background (from neutral to saturated)
  const chromaGradient = `linear-gradient(to right, 
    ${hexFromHct(hue, 0, tone)},
    ${hexFromHct(hue, 50, tone)},
    ${hexFromHct(hue, 100, tone)},
    ${hexFromHct(hue, 150, tone)}
  )`;
  
  // Generate tone gradient background (from dark to light)
  const toneGradient = `linear-gradient(to right, 
    ${hexFromHct(hue, chroma, 0)},
    ${hexFromHct(hue, chroma, 25)},
    ${hexFromHct(hue, chroma, 50)},
    ${hexFromHct(hue, chroma, 75)},
    ${hexFromHct(hue, chroma, 100)}
  )`;
  
  return (
    <div className="hct-picker-overlay" onClick={onCancel}>
      <div className="hct-picker-dialog" onClick={(e) => e.stopPropagation()}>
        {/* Header with icon */}
        <div className="hct-picker-header">
          <svg className="hct-picker-icon" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 22C6.49 22 2 17.51 2 12S6.49 2 12 2s10 4.04 10 9c0 3.31-2.69 6-6 6h-1.77c-.28 0-.5.22-.5.5 0 .12.05.23.13.33.41.47.64 1.06.64 1.67A2.5 2.5 0 0 1 12 22zm0-18c-4.41 0-8 3.59-8 8s3.59 8 8 8c.28 0 .5-.22.5-.5a.54.54 0 0 0-.14-.35c-.41-.46-.63-1.05-.63-1.65a2.5 2.5 0 0 1 2.5-2.5H16c2.21 0 4-1.79 4-4 0-3.86-3.59-7-8-7z"/>
            <circle cx="6.5" cy="11.5" r="1.5"/>
            <circle cx="9.5" cy="7.5" r="1.5"/>
            <circle cx="14.5" cy="7.5" r="1.5"/>
            <circle cx="17.5" cy="11.5" r="1.5"/>
          </svg>
        </div>
        
        <h2 className="hct-picker-title">HCT Color Picker</h2>
        
        {/* Hex Input */}
        <div className="hct-picker-row">
          <label className="hct-picker-label">Hex Color</label>
          <input
            type="text"
            className="hct-picker-input"
            value={hexValue}
            onChange={handleHexChange}
            onBlur={handleHexBlur}
            maxLength={7}
          />
        </div>
        
        {/* Hue Slider */}
        <div className="hct-picker-row">
          <label className="hct-picker-label">Hue</label>
          <input
            type="number"
            className="hct-picker-input"
            value={Math.round(hue)}
            onChange={(e) => setHue(Math.max(0, Math.min(360, Number(e.target.value))))}
            min={0}
            max={360}
          />
        </div>
        <div className="hct-picker-slider-container">
          <div 
            className="hct-picker-slider-track"
            style={{ background: hueGradient }}
          />
          <input
            type="range"
            className="hct-picker-slider"
            min={0}
            max={360}
            step={1}
            value={hue}
            onChange={(e) => setHue(Number(e.target.value))}
          />
        </div>
        
        {/* Chroma Slider */}
        <div className="hct-picker-row">
          <label className="hct-picker-label">Chroma</label>
          <input
            type="number"
            className="hct-picker-input"
            value={chroma.toFixed(1)}
            onChange={(e) => setChroma(Math.max(0, Math.min(150, Number(e.target.value))))}
            min={0}
            max={150}
            step={0.1}
          />
        </div>
        <div className="hct-picker-slider-container">
          <div 
            className="hct-picker-slider-track"
            style={{ background: chromaGradient }}
          />
          <input
            type="range"
            className="hct-picker-slider"
            min={0}
            max={150}
            step={0.1}
            value={chroma}
            onChange={(e) => setChroma(Number(e.target.value))}
          />
        </div>
        
        {/* Tone Slider */}
        <div className="hct-picker-row">
          <label className="hct-picker-label">Tone</label>
          <input
            type="number"
            className="hct-picker-input"
            value={tone.toFixed(1)}
            onChange={(e) => setTone(Math.max(0, Math.min(100, Number(e.target.value))))}
            min={0}
            max={100}
            step={0.1}
          />
        </div>
        <div className="hct-picker-slider-container">
          <div 
            className="hct-picker-slider-track"
            style={{ background: toneGradient }}
          />
          <input
            type="range"
            className="hct-picker-slider"
            min={0}
            max={100}
            step={0.1}
            value={tone}
            onChange={(e) => setTone(Number(e.target.value))}
          />
        </div>
        
        {/* Preview Swatch */}
        <div className="hct-picker-preview">
          <div 
            className="hct-picker-swatch"
            style={{ backgroundColor: currentColor }}
          />
        </div>
        
        {/* Actions */}
        <div className="hct-picker-actions">
          <button 
            className="hct-picker-btn cancel" 
            onClick={(e) => {
              e.stopPropagation();
              onCancel();
            }}
          >
            Cancel
          </button>
          <button 
            className="hct-picker-btn apply" 
            onClick={(e) => {
              e.stopPropagation();
              onApply(currentColor);
            }}
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  );
};

export default HctColorPicker;

