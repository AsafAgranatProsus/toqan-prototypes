import React from 'react';
import { M3Theme, getTonalPaletteColors } from '../../themes/m3';
import './PalettePreview.css';

export interface PalettePreviewProps {
  theme: M3Theme;
}

interface TonalRowProps {
  name: string;
  colors: { tone: number; hex: string }[];
}

const TonalRow: React.FC<TonalRowProps> = ({ name, colors }) => {
  return (
    <div className="tonal-row">
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

export const PalettePreview: React.FC<PalettePreviewProps> = ({ theme }) => {
  const palettes = [
    { name: 'Primary', palette: theme.palettes.primary },
    { name: 'Secondary', palette: theme.palettes.secondary },
    { name: 'Tertiary', palette: theme.palettes.tertiary },
    { name: 'Neutral', palette: theme.palettes.neutral },
    { name: 'Neutral Variant', palette: theme.palettes.neutralVariant },
    { name: 'Error', palette: theme.palettes.error },
  ];
  
  return (
    <div className="palette-preview">
      {palettes.map(({ name, palette }) => (
        <TonalRow
          key={name}
          name={name}
          colors={getTonalPaletteColors(palette)}
        />
      ))}
    </div>
  );
};

