import React, { useState } from 'react';
import { CoreColors } from './M3ThemeBuilder';
import { HctColorPicker } from './HctColorPicker';
import './CoreColorsList.css';

export interface CoreColorsListProps {
  colors: CoreColors;
  onChange: (key: keyof CoreColors, value: string) => void;
}

interface ColorItemProps {
  label: string;
  sublabel?: string;
  color: string;
  onChange: (value: string) => void;
}

const ColorItem: React.FC<ColorItemProps> = ({ label, sublabel, color, onChange }) => {
  const [showPicker, setShowPicker] = useState(false);
  
  return (
    <div className="core-color-item-wrapper">
      <div 
        className="core-color-item" 
        onClick={() => setShowPicker(true)}
        role="button"
        tabIndex={0}
        aria-label={`${label}: ${color}`}
      >
        <div 
          className="core-color-swatch"
          style={{ backgroundColor: color }}
          aria-hidden="true"
        />
        <div className="core-color-info">
          <span className="core-color-label">{label}</span>
          {sublabel && <span className="core-color-sublabel">{sublabel}</span>}
        </div>
      </div>
      {showPicker && (
        <HctColorPicker
          color={color}
          onApply={(newColor) => {
            onChange(newColor);
            setShowPicker(false);
          }}
          onCancel={() => setShowPicker(false)}
        />
      )}
    </div>
  );
};

export const CoreColorsList: React.FC<CoreColorsListProps> = ({ colors, onChange }) => {
  return (
    <div className="core-colors-list">
      <ColorItem
        label="Primary"
        sublabel="Acts as custom source color"
        color={colors.primary}
        onChange={(value) => onChange('primary', value)}
      />
      <ColorItem
        label="Secondary"
        sublabel="Supporting color for less prominent components"
        color={colors.secondary}
        onChange={(value) => onChange('secondary', value)}
      />
      <ColorItem
        label="Tertiary"
        sublabel="Accent color for contrast and visual interest"
        color={colors.tertiary}
        onChange={(value) => onChange('tertiary', value)}
      />
      <ColorItem
        label="Error"
        sublabel="Indicates errors and destructive actions"
        color={colors.error}
        onChange={(value) => onChange('error', value)}
      />
      <ColorItem
        label="Neutral"
        sublabel="Used for background and surfaces"
        color={colors.neutral}
        onChange={(value) => onChange('neutral', value)}
      />
      <ColorItem
        label="Neutral Variant"
        sublabel="Used for medium emphasis and variants"
        color={colors.neutralVariant}
        onChange={(value) => onChange('neutralVariant', value)}
      />
    </div>
  );
};

