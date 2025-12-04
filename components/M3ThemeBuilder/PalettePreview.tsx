import React, { useMemo } from 'react';
import { M3Theme, getTonalPaletteColors, generateExtendedColorPalettes, ExtendedColorInput } from '../../themes/m3';
import { ExtendedColor } from './M3ThemeBuilder';
import './PalettePreview.css';

export interface PalettePreviewProps {
  theme: M3Theme;
  extendedColors?: ExtendedColor[];
  sourceColor?: string;
}

interface TonalRowProps {
  name: string;
  description?: string;
  colors: { tone: number; hex: string }[];
  isExtended?: boolean;
}

const TonalRow: React.FC<TonalRowProps> = ({ name, description, colors, isExtended }) => {
  return (
    <div className={`tonal-row ${isExtended ? 'tonal-row-extended' : ''}`}>
      <div className="tonal-row-header">
        <span className="tonal-row-name">{name}</span>
        {description && <span className="tonal-row-desc">{description}</span>}
      </div>
      <div className="tonal-row-colors">
        {colors.map(({ tone, hex }) => (
          <div
            key={tone}
            className="tonal-color"
            style={{ backgroundColor: hex }}
            title={`${name} ${tone}: ${hex}`}
          >
            <span className="tonal-tone">{tone}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export const PalettePreview: React.FC<PalettePreviewProps> = ({ 
  theme, 
  extendedColors = [],
  sourceColor = '#6750A4',
}) => {
  const corePalettes = [
    { name: 'Primary', palette: theme.palettes.primary, description: 'Full tonal range of primary brand color' },
    { name: 'Secondary', palette: theme.palettes.secondary, description: 'Supporting accent tones' },
    { name: 'Tertiary', palette: theme.palettes.tertiary, description: 'Complementary accent tones' },
    { name: 'Neutral', palette: theme.palettes.neutral, description: 'Background and surface tones' },
    { name: 'Neutral Variant', palette: theme.palettes.neutralVariant, description: 'Muted variants for borders and dividers' },
    { name: 'Error', palette: theme.palettes.error, description: 'Error and warning state tones' },
  ];
  
  // Generate extended color palettes
  const extendedPalettes = useMemo(() => {
    if (extendedColors.length === 0) return [];
    
    const inputs: ExtendedColorInput[] = extendedColors.map(c => ({
      id: c.id,
      name: c.name,
      description: c.description,
      color: c.color,
      blend: c.blend,
    }));
    
    return generateExtendedColorPalettes(inputs, sourceColor);
  }, [extendedColors, sourceColor]);
  
  return (
    <div className="palette-preview">
      {corePalettes.map(({ name, palette, description }) => (
        <TonalRow
          key={name}
          name={name}
          description={description}
          colors={getTonalPaletteColors(palette)}
        />
      ))}
      
      {extendedPalettes.length > 0 && (
        <>
          <div className="palette-divider">
            <span>Extended Colors</span>
          </div>
          {extendedPalettes.map((extended) => (
            <TonalRow
              key={extended.id}
              name={extended.name}
              colors={getTonalPaletteColors(extended.palette)}
              isExtended
            />
          ))}
        </>
      )}
    </div>
  );
};

