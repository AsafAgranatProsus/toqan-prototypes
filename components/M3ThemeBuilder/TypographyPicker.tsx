import React from 'react';
import { CustomSelect, SelectGroup } from './CustomSelect';
import './TypographyPicker.css';

// Sans-serif fonts for testing (matches FeatureMenu exactly)
const SANS_SERIF_FONTS = [
  'Soehne',
  'Inter',
  'Noto Sans',
  'Roboto',
  'Host Grotesk',
  'Open Sans',
  'Lato',
  'Montserrat',
  'Poppins',
  'Source Sans 3',
  'Raleway',
  'Work Sans',
  'Nunito',
];

// Serif fonts (matches FeatureMenu exactly)
const SERIF_FONTS = [
  'Playfair Display',
  'Merriweather',
  'Lora',
  'PT Serif',
  'Crimson Text',
  'Source Serif 4',
  'Libre Baskerville',
  'EB Garamond',
  'Cormorant',
  'Spectral',
];

// Build grouped options for CustomSelect
const FONT_GROUPS: SelectGroup[] = [
  {
    label: 'Sans Serif',
    options: SANS_SERIF_FONTS.map(font => ({ value: font, label: font })),
  },
  {
    label: 'Serif',
    options: SERIF_FONTS.map(font => ({ value: font, label: font })),
  },
];

export interface TypographyPickerProps {
  displayFont: string;
  bodyFont: string;
  onDisplayFontChange: (font: string) => void;
  onBodyFontChange: (font: string) => void;
}

export const TypographyPicker: React.FC<TypographyPickerProps> = ({
  displayFont,
  bodyFont,
  onDisplayFontChange,
  onBodyFontChange,
}) => {
  return (
    <div className="typography-picker">
      <div className="typography-field">
        <label className="typography-label">Display</label>
        <CustomSelect
          value={displayFont}
          onChange={onDisplayFontChange}
          groups={FONT_GROUPS}
          className="typography-custom-select"
        />
      </div>
      
      <div className="typography-field">
        <label className="typography-label">Body</label>
        <CustomSelect
          value={bodyFont}
          onChange={onBodyFontChange}
          groups={FONT_GROUPS}
          className="typography-custom-select"
        />
      </div>
    </div>
  );
};
