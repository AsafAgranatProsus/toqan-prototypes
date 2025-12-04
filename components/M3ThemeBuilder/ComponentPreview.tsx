import React, { useMemo } from 'react';
import { M3Theme, argbToHex } from '../../themes/m3';
import './ComponentPreview.css';

export interface ComponentPreviewProps {
  theme: M3Theme;
  mode: 'light' | 'dark';
  typography?: {
    displayFont: string;
    bodyFont: string;
  };
}

export const ComponentPreview: React.FC<ComponentPreviewProps> = ({ 
  theme, 
  mode,
  typography = { displayFont: 'Roboto', bodyFont: 'Roboto' },
}) => {
  const scheme = mode === 'light' ? theme.schemes.light : theme.schemes.dark;
  const palettes = theme.palettes;
  
  // Surface container tones vary by mode
  const surfaceContainerTones = mode === 'light' 
    ? { lowest: 100, low: 96, default: 94, high: 92, highest: 90, dim: 87, bright: 98 }
    : { lowest: 4, low: 10, default: 12, high: 17, highest: 22, dim: 6, bright: 24 };
  
  // Generate CSS variables for preview
  const previewStyles = useMemo(() => ({
    '--preview-primary': argbToHex(scheme.primary),
    '--preview-on-primary': argbToHex(scheme.onPrimary),
    '--preview-primary-container': argbToHex(scheme.primaryContainer),
    '--preview-on-primary-container': argbToHex(scheme.onPrimaryContainer),
    '--preview-secondary': argbToHex(scheme.secondary),
    '--preview-on-secondary': argbToHex(scheme.onSecondary),
    '--preview-secondary-container': argbToHex(scheme.secondaryContainer),
    '--preview-on-secondary-container': argbToHex(scheme.onSecondaryContainer),
    '--preview-tertiary': argbToHex(scheme.tertiary),
    '--preview-on-tertiary': argbToHex(scheme.onTertiary),
    '--preview-tertiary-container': argbToHex(scheme.tertiaryContainer),
    '--preview-on-tertiary-container': argbToHex(scheme.onTertiaryContainer),
    '--preview-error': argbToHex(scheme.error),
    '--preview-on-error': argbToHex(scheme.onError),
    '--preview-background': argbToHex(scheme.background),
    '--preview-on-background': argbToHex(scheme.onBackground),
    '--preview-surface': argbToHex(scheme.surface),
    '--preview-on-surface': argbToHex(scheme.onSurface),
    '--preview-surface-variant': argbToHex(scheme.surfaceVariant),
    '--preview-on-surface-variant': argbToHex(scheme.onSurfaceVariant),
    '--preview-outline': argbToHex(scheme.outline),
    '--preview-outline-variant': argbToHex(scheme.outlineVariant),
    // Surface containers
    '--preview-surface-container-lowest': argbToHex(palettes.neutral.tone(surfaceContainerTones.lowest)),
    '--preview-surface-container-low': argbToHex(palettes.neutral.tone(surfaceContainerTones.low)),
    '--preview-surface-container': argbToHex(palettes.neutral.tone(surfaceContainerTones.default)),
    '--preview-surface-container-high': argbToHex(palettes.neutral.tone(surfaceContainerTones.high)),
    '--preview-surface-container-highest': argbToHex(palettes.neutral.tone(surfaceContainerTones.highest)),
    '--preview-surface-dim': argbToHex(palettes.neutral.tone(surfaceContainerTones.dim)),
    '--preview-surface-bright': argbToHex(palettes.neutral.tone(surfaceContainerTones.bright)),
    // Inverse
    '--preview-inverse-surface': argbToHex(scheme.inverseSurface),
    '--preview-inverse-on-surface': argbToHex(scheme.inverseOnSurface),
    '--preview-inverse-primary': argbToHex(scheme.inversePrimary),
    // Typography
    '--preview-display-font': typography.displayFont,
    '--preview-body-font': typography.bodyFont,
  } as React.CSSProperties), [scheme, palettes, surfaceContainerTones, typography]);
  
  return (
    <div className="component-preview" style={previewStyles}>
      <div className="preview-surface">
        {/* Text Fields */}
        <div className="preview-row">
          <div className="preview-textfield">
            <input type="text" placeholder="Textfield" />
          </div>
          <div className="preview-textfield filled">
            <input type="text" placeholder="Filled" />
          </div>
        </div>
        
        {/* Chips */}
        <div className="preview-row">
          <button className="preview-chip assist">
            <span className="chip-icon">ℹ</span>
            Assist
          </button>
          <button className="preview-chip filter selected">
            <span className="chip-icon">≡</span>
            Filter
          </button>
          <button className="preview-chip suggestion">
            <span className="chip-icon">?</span>
            Suggestion
          </button>
        </div>
        
        {/* Buttons */}
        <div className="preview-row">
          <button className="preview-btn filled">Button</button>
          <button className="preview-btn tonal">
            <span className="btn-icon">+</span>
            Button
          </button>
          <button className="preview-btn outlined">Button</button>
          <button className="preview-btn text">Button</button>
        </div>
        
        {/* FABs */}
        <div className="preview-row">
          <button className="preview-fab small">
            <span>+</span>
          </button>
          <button className="preview-fab">
            <span>+</span>
          </button>
          <button className="preview-fab large">
            <span>+</span>
          </button>
          <button className="preview-fab extended">
            <span>+</span>
            Button
          </button>
        </div>
        
        {/* Cards */}
        <div className="preview-row cards">
          <div className="preview-card elevated">
            <div className="card-header">Elevated Card</div>
            <div className="card-body">Surface with elevation</div>
          </div>
          <div className="preview-card filled">
            <div className="card-header">Filled Card</div>
            <div className="card-body">Surface variant fill</div>
          </div>
          <div className="preview-card outlined">
            <div className="card-header">Outlined Card</div>
            <div className="card-body">Outline border</div>
          </div>
        </div>
        
        {/* Snackbar - demonstrates inverse colors in context */}
        <div className="preview-snackbar">
          <span className="snackbar-message">Message sent successfully</span>
          <button className="snackbar-action">Undo</button>
        </div>
      </div>
    </div>
  );
};

