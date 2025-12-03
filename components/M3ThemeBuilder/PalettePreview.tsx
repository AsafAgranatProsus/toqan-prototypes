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
  colors: { tone: number; hex: string }[];
  isExtended?: boolean;
}

const TonalRow: React.FC<TonalRowProps> = ({ name, colors, isExtended }) => {
  return (
    <div className={`tonal-row ${isExtended ? 'tonal-row-extended' : ''}`}>
      <span className="tonal-row-name">{name}</span>
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
    { name: 'Primary', palette: theme.palettes.primary },
    { name: 'Secondary', palette: theme.palettes.secondary },
    { name: 'Tertiary', palette: theme.palettes.tertiary },
    { name: 'Neutral', palette: theme.palettes.neutral },
    { name: 'Neutral Variant', palette: theme.palettes.neutralVariant },
    { name: 'Error', palette: theme.palettes.error },
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
      {corePalettes.map(({ name, palette }) => (
        <TonalRow
          key={name}
          name={name}
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

