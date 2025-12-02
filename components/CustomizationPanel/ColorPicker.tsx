import React, { useState, useEffect, useCallback, useRef } from 'react';
import { RgbaColorPicker, RgbaColor } from 'react-colorful';
import './ColorPicker.css';

/**
 * Debounce hook for performance optimization
 */
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}

export interface ColorPickerProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
}

/**
 * Parse any color format to RGBA object
 */
function parseColorToRgba(color: string): RgbaColor {
  // Default fallback
  const defaultColor: RgbaColor = { r: 0, g: 0, b: 0, a: 1 };
  
  if (!color || color.trim() === '') {
    return defaultColor;
  }
  
  try {
    // Use canvas to parse any color format
    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;
    const ctx = canvas.getContext('2d');
    
    if (!ctx) return defaultColor;
    
    // Handle rgba/hsla with alpha
    let alpha = 1;
    
    // Extract alpha from rgba()
    const rgbaMatch = color.match(/rgba?\((\d+),?\s*(\d+),?\s*(\d+)(?:,?\s*([\d.]+))?\)/i);
    if (rgbaMatch) {
      return {
        r: parseInt(rgbaMatch[1]),
        g: parseInt(rgbaMatch[2]),
        b: parseInt(rgbaMatch[3]),
        a: rgbaMatch[4] ? parseFloat(rgbaMatch[4]) : 1
      };
    }
    
    // Extract alpha from hsla()
    const hslaMatch = color.match(/hsla?\([\d.]+,?\s*[\d.]+%?,?\s*[\d.]+%?(?:,?\s*\/?\s*([\d.]+%?))?\)/i);
    if (hslaMatch && hslaMatch[1]) {
      const alphaStr = hslaMatch[1];
      alpha = alphaStr.endsWith('%') ? parseFloat(alphaStr) / 100 : parseFloat(alphaStr);
    }
    
    // Extract alpha from hex with alpha (#RRGGBBAA)
    if (color.match(/^#[0-9a-f]{8}$/i)) {
      const hex = color.slice(1);
      return {
        r: parseInt(hex.slice(0, 2), 16),
        g: parseInt(hex.slice(2, 4), 16),
        b: parseInt(hex.slice(4, 6), 16),
        a: parseInt(hex.slice(6, 8), 16) / 255
      };
    }
    
    // Use canvas for other formats
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, 1, 1);
    const imageData = ctx.getImageData(0, 0, 1, 1).data;
    
    return {
      r: imageData[0],
      g: imageData[1],
      b: imageData[2],
      a: alpha
    };
  } catch (error) {
    console.error('Color parsing error:', error, 'for color:', color);
    return defaultColor;
  }
}

/**
 * Convert RGBA object to string format
 */
function rgbaToString(rgba: RgbaColor, format: 'hex' | 'rgba' | 'hsla' = 'rgba'): string {
  if (format === 'hex') {
    const toHex = (n: number) => n.toString(16).padStart(2, '0');
    if (rgba.a < 1) {
      // Include alpha in hex
      return `#${toHex(rgba.r)}${toHex(rgba.g)}${toHex(rgba.b)}${toHex(Math.round(rgba.a * 255))}`;
    }
    return `#${toHex(rgba.r)}${toHex(rgba.g)}${toHex(rgba.b)}`;
  }
  
  if (format === 'hsla') {
    // Convert RGB to HSL
    const r = rgba.r / 255;
    const g = rgba.g / 255;
    const b = rgba.b / 255;
    
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0;
    let s = 0;
    const l = (max + min) / 2;
    
    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      
      switch (max) {
        case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
        case g: h = ((b - r) / d + 2) / 6; break;
        case b: h = ((r - g) / d + 4) / 6; break;
      }
    }
    
    const hDeg = Math.round(h * 360);
    const sPercent = Math.round(s * 100);
    const lPercent = Math.round(l * 100);
    
    if (rgba.a < 1) {
      return `hsla(${hDeg}, ${sPercent}%, ${lPercent}%, ${rgba.a.toFixed(2)})`;
    }
    return `hsl(${hDeg}, ${sPercent}%, ${lPercent}%)`;
  }
  
  // Default: rgba
  if (rgba.a < 1) {
    return `rgba(${rgba.r}, ${rgba.g}, ${rgba.b}, ${rgba.a.toFixed(2)})`;
  }
  return `rgb(${rgba.r}, ${rgba.g}, ${rgba.b})`;
}

/**
 * Detect color format from string
 */
function detectColorFormat(color: string): 'hex' | 'rgba' | 'hsla' {
  if (color.startsWith('#')) return 'hex';
  if (color.startsWith('hsl')) return 'hsla';
  return 'rgba';
}

/**
 * Get display format name
 */
function getFormatDisplayName(format: 'hex' | 'rgba' | 'hsla'): string {
  switch (format) {
    case 'hex': return 'HEX';
    case 'rgba': return 'RGB';
    case 'hsla': return 'HSL';
  }
}

/**
 * Multi-format color picker with alpha support
 */
export const ColorPicker: React.FC<ColorPickerProps> = ({ value, onChange, label }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [rgbaColor, setRgbaColor] = useState<RgbaColor>(() => parseColorToRgba(value));
  const [textValue, setTextValue] = useState(value);
  const [outputFormat, setOutputFormat] = useState<'hex' | 'rgba' | 'hsla'>(() => detectColorFormat(value));
  const pickerRef = useRef<HTMLDivElement>(null);
  const isExternalUpdate = useRef(false);
  
  // Debounce the color for expensive onChange operations
  const debouncedColor = useDebounce(rgbaColor, 50);
  
  // Update internal state when external value changes
  useEffect(() => {
    isExternalUpdate.current = true;
    setRgbaColor(parseColorToRgba(value));
    setTextValue(value);
    setOutputFormat(detectColorFormat(value));
  }, [value]);
  
  // Call onChange only when debounced color changes (not on every drag)
  useEffect(() => {
    // Skip if this was triggered by an external value update
    if (isExternalUpdate.current) {
      isExternalUpdate.current = false;
      return;
    }
    
    const colorString = rgbaToString(debouncedColor, outputFormat);
    // Only call onChange if the value actually changed
    if (colorString !== value) {
      onChange(colorString);
    }
  }, [debouncedColor, outputFormat, onChange, value]);
  
  // Close picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);
  
  // Update local state immediately for smooth UI, debounced onChange handles the rest
  const handleColorChange = useCallback((newColor: RgbaColor) => {
    setRgbaColor(newColor);
    const colorString = rgbaToString(newColor, outputFormat);
    setTextValue(colorString);
    // Don't call onChange here - let the debounced effect handle it
  }, [outputFormat]);
  
  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTextValue(e.target.value);
  };
  
  const handleTextBlur = () => {
    try {
      const parsed = parseColorToRgba(textValue);
      setRgbaColor(parsed);
      setOutputFormat(detectColorFormat(textValue));
      onChange(textValue);
    } catch {
      // Revert to previous value if invalid
      setTextValue(rgbaToString(rgbaColor, outputFormat));
    }
  };
  
  const handleTextKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleTextBlur();
    }
  };
  
  const cycleFormat = () => {
    const formats: Array<'hex' | 'rgba' | 'hsla'> = ['hex', 'rgba', 'hsla'];
    const currentIndex = formats.indexOf(outputFormat);
    const nextFormat = formats[(currentIndex + 1) % formats.length];
    setOutputFormat(nextFormat);
    const newColorString = rgbaToString(rgbaColor, nextFormat);
    setTextValue(newColorString);
    onChange(newColorString);
  };
  
  // Generate preview color (always as rgba for CSS)
  const previewColor = `rgba(${rgbaColor.r}, ${rgbaColor.g}, ${rgbaColor.b}, ${rgbaColor.a})`;
  
  return (
    <div className="color-picker" ref={pickerRef}>
      {label && <label className="color-picker-label">{label}</label>}
      <div className="color-picker-controls">
        <button
          type="button"
          className="color-picker-swatch"
          onClick={() => setIsOpen(!isOpen)}
          title="Pick a color"
          aria-label="Open color picker"
        >
          <span 
            className="color-picker-swatch-color"
            style={{ backgroundColor: previewColor }}
          />
          {rgbaColor.a < 1 && (
            <span className="color-picker-swatch-alpha">
              {Math.round(rgbaColor.a * 100)}%
            </span>
          )}
        </button>
        <input
          type="text"
          value={textValue}
          onChange={handleTextChange}
          onBlur={handleTextBlur}
          onKeyDown={handleTextKeyDown}
          className="color-picker-input"
          placeholder="#000000"
        />
        <button 
          type="button"
          className="color-picker-format"
          onClick={cycleFormat}
          title="Click to change format"
        >
          {getFormatDisplayName(outputFormat)}
        </button>
      </div>
      
      {isOpen && (
        <div className="color-picker-popover">
          <RgbaColorPicker color={rgbaColor} onChange={handleColorChange} />
          <div className="color-picker-alpha-label">
            Opacity: {Math.round(rgbaColor.a * 100)}%
          </div>
        </div>
      )}
    </div>
  );
};
