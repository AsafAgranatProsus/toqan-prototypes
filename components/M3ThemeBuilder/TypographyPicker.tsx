import React from 'react';
import './TypographyPicker.css';

// Sans-serif fonts (good for display and body)
const SANS_SERIF_FONTS = [
  'Roboto',
  'Inter',
  'Open Sans',
  'Lato',
  'Montserrat',
  'Poppins',
  'Source Sans 3',
  'Nunito',
  'Work Sans',
  'Raleway',
  'DM Sans',
  'Plus Jakarta Sans',
];

// Serif fonts (good for display headings)
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

// Combined options for display (can use serif for headings)
const DISPLAY_FONT_OPTIONS = [...SANS_SERIF_FONTS, ...SERIF_FONTS];

// Body fonts should generally be sans-serif for readability
const BODY_FONT_OPTIONS = SANS_SERIF_FONTS;

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
        <select
          className="typography-select"
          value={displayFont}
          onChange={(e) => onDisplayFontChange(e.target.value)}
          style={{ fontFamily: displayFont }}
        >
          <optgroup label="Sans Serif">
            {SANS_SERIF_FONTS.map((font) => (
              <option key={font} value={font}>
                {font}
              </option>
            ))}
          </optgroup>
          <optgroup label="Serif">
            {SERIF_FONTS.map((font) => (
              <option key={font} value={font}>
                {font}
              </option>
            ))}
          </optgroup>
        </select>
      </div>
      
      <div className="typography-field">
        <label className="typography-label">Body</label>
        <select
          className="typography-select"
          value={bodyFont}
          onChange={(e) => onBodyFontChange(e.target.value)}
          style={{ fontFamily: bodyFont }}
        >
          {BODY_FONT_OPTIONS.map((font) => (
            <option key={font} value={font}>
              {font}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

