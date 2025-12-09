import React, { useState } from 'react';
import { M3Theme, argbToHex, Scheme } from '../../themes/m3';
import './SchemePreview.css';

export interface SchemePreviewProps {
  theme: M3Theme;
  mode: 'light' | 'dark';
}

// Surface container tones by mode
const SURFACE_CONTAINER_TONES = {
  light: { lowest: 100, low: 96, default: 94, high: 92, highest: 90, dim: 87, bright: 98 },
  dark: { lowest: 4, low: 10, default: 12, high: 17, highest: 22, dim: 6, bright: 24 },
};

interface ColorRoleProps {
  name: string;
  color: number;
  onColor?: number;
  description?: string;
  tokenName?: string;
}

const ColorRole: React.FC<ColorRoleProps> = ({ name, color, onColor, description, tokenName }) => {
  const [copied, setCopied] = useState(false);
  const bgHex = argbToHex(color);
  const textHex = onColor ? argbToHex(onColor) : undefined;
  
  // Generate token name if not provided
  const cssVarName = tokenName || `--color-${name.toLowerCase().replace(/\s+/g, '-')}`;
  const tooltip = description 
    ? `${name}: ${bgHex}\n${description}\n\nClick to copy: ${cssVarName}` 
    : `${name}: ${bgHex}\n\nClick to copy: ${cssVarName}`;
  
  const handleClick = async () => {
    try {
      await navigator.clipboard.writeText(cssVarName);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy token name:', err);
    }
  };
  
  return (
    <div 
      className={`color-role ${copied ? 'color-role--copied' : ''}`}
      style={{ 
        backgroundColor: bgHex,
        color: textHex || (isLightColor(bgHex) ? '#000' : '#fff'),
      }}
      title={tooltip}
      onClick={handleClick}
    >
      <span className="color-role-name">{name}</span>
      <span className="color-role-value">{bgHex}</span>
      {copied && (
        <span className="color-role-copied-indicator">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M13.5 4L6 11.5L2.5 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Copied!
        </span>
      )}
    </div>
  );
};

// Check if a color is light (for text contrast)
function isLightColor(hex: string): boolean {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.5;
}

export const SchemePreview: React.FC<SchemePreviewProps> = ({ theme, mode }) => {
  const scheme = mode === 'light' ? theme.schemes.light : theme.schemes.dark;
  
  // Group colors by category
  const primaryColors = [
    { name: 'Primary', color: scheme.primary, onColor: scheme.onPrimary },
    { name: 'On Primary', color: scheme.onPrimary },
    { name: 'Primary Container', color: scheme.primaryContainer, onColor: scheme.onPrimaryContainer },
    { name: 'On Primary Container', color: scheme.onPrimaryContainer },
  ];
  
  const secondaryColors = [
    { name: 'Secondary', color: scheme.secondary, onColor: scheme.onSecondary },
    { name: 'On Secondary', color: scheme.onSecondary },
    { name: 'Secondary Container', color: scheme.secondaryContainer, onColor: scheme.onSecondaryContainer },
    { name: 'On Secondary Container', color: scheme.onSecondaryContainer },
  ];
  
  const tertiaryColors = [
    { name: 'Tertiary', color: scheme.tertiary, onColor: scheme.onTertiary },
    { name: 'On Tertiary', color: scheme.onTertiary },
    { name: 'Tertiary Container', color: scheme.tertiaryContainer, onColor: scheme.onTertiaryContainer },
    { name: 'On Tertiary Container', color: scheme.onTertiaryContainer },
  ];
  
  const errorColors = [
    { name: 'Error', color: scheme.error, onColor: scheme.onError },
    { name: 'On Error', color: scheme.onError },
    { name: 'Error Container', color: scheme.errorContainer, onColor: scheme.onErrorContainer },
    { name: 'On Error Container', color: scheme.onErrorContainer },
  ];
  
  const surfaceColors = [
    { name: 'Background', color: scheme.background, onColor: scheme.onBackground },
    { name: 'On Background', color: scheme.onBackground },
    { name: 'Surface', color: scheme.surface, onColor: scheme.onSurface },
    { name: 'On Surface', color: scheme.onSurface },
    { name: 'Surface Variant', color: scheme.surfaceVariant, onColor: scheme.onSurfaceVariant },
    { name: 'On Surface Variant', color: scheme.onSurfaceVariant },
  ];
  
  const otherColors = [
    { name: 'Outline', color: scheme.outline },
    { name: 'Outline Variant', color: scheme.outlineVariant },
    { name: 'Inverse Surface', color: scheme.inverseSurface },
    { name: 'Inverse On Surface', color: scheme.inverseOnSurface },
    { name: 'Inverse Primary', color: scheme.inversePrimary },
  ];
  
  return (
    <div className="scheme-preview">
      <h3 className="scheme-preview-title">
        {mode === 'light' ? 'Light' : 'Dark'} Scheme
      </h3>
      
      <div className="scheme-grid">
        <div className="scheme-row scheme-row-main">
          {[
            { name: 'Primary', color: scheme.primary, description: 'Main brand color for key UI elements', tokenName: '--color-primary-default' },
            { name: 'Secondary', color: scheme.secondary, description: 'Supporting color for less prominent components', tokenName: '--color-secondary-default' },
            { name: 'Tertiary', color: scheme.tertiary, description: 'Accent for contrast and visual interest', tokenName: '--color-tertiary-default' },
            { name: 'Error', color: scheme.error, description: 'Indicates errors and destructive actions', tokenName: '--color-error-default' },
          ].map((item) => (
            <ColorRole key={item.name} {...item} />
          ))}
        </div>
        
        <div className="scheme-row scheme-row-on">
          {[
            { name: 'On Primary', color: scheme.onPrimary, description: 'Text/icons on primary backgrounds', tokenName: '--color-btn-primary-text' },
            { name: 'On Secondary', color: scheme.onSecondary, description: 'Text/icons on secondary backgrounds', tokenName: '--color-btn-secondary-text' },
            { name: 'On Tertiary', color: scheme.onTertiary, description: 'Text/icons on tertiary backgrounds', tokenName: '--color-btn-tertiary-text' },
            { name: 'On Error', color: scheme.onError, description: 'Text/icons on error backgrounds', tokenName: '--color-text-light' },
          ].map((item) => (
            <ColorRole key={item.name} {...item} />
          ))}
        </div>
        
        <div className="scheme-row scheme-row-container">
          {[
            { name: 'Primary Container', color: scheme.primaryContainer, description: 'Lower emphasis fill for cards and chips', tokenName: '--color-primary-light' },
            { name: 'Secondary Container', color: scheme.secondaryContainer, description: 'Lower emphasis secondary fills', tokenName: '--color-secondary-light' },
            { name: 'Tertiary Container', color: scheme.tertiaryContainer, description: 'Lower emphasis tertiary fills', tokenName: '--color-tertiary-light' },
            { name: 'Error Container', color: scheme.errorContainer, description: 'Lower emphasis error fills', tokenName: '--color-error-background' },
          ].map((item) => (
            <ColorRole key={item.name} {...item} />
          ))}
        </div>
        
        <div className="scheme-row scheme-row-on-container">
          {[
            { name: 'On Primary Container', color: scheme.onPrimaryContainer, description: 'Text/icons on container backgrounds', tokenName: '--color-primary-default' },
            { name: 'On Secondary Container', color: scheme.onSecondaryContainer, description: 'Text/icons on container backgrounds', tokenName: '--color-secondary-default' },
            { name: 'On Tertiary Container', color: scheme.onTertiaryContainer, description: 'Text/icons on container backgrounds', tokenName: '--color-tertiary-default' },
            { name: 'On Error Container', color: scheme.onErrorContainer, description: 'Text/icons on container backgrounds', tokenName: '--color-error-default' },
          ].map((item) => (
            <ColorRole key={item.name} {...item} />
          ))}
        </div>
      </div>
      
      <div className="scheme-surfaces">
        <div className="scheme-surface-row">
          <ColorRole name="Background" color={scheme.background} description="App background color" tokenName="--color-ui-background" />
          <ColorRole name="Surface" color={scheme.surface} description="Card and sheet backgrounds" tokenName="--color-ui-background-elevated" />
          <ColorRole name="Surface Variant" color={scheme.surfaceVariant} description="Alternative surface for visual grouping" tokenName="--color-surface-variant" />
        </div>
        <div className="scheme-surface-row">
          <ColorRole name="Outline" color={scheme.outline} description="Borders and dividers" tokenName="--color-ui-border" />
          <ColorRole name="Outline Variant" color={scheme.outlineVariant} description="Subtle borders and decorative lines" tokenName="--color-ui-border" />
        </div>
      </div>
      
      {/* Surface Container Hierarchy */}
      <div className="scheme-section-label">Surface Containers <span className="section-hint">Elevation hierarchy from lowest to highest</span></div>
      <div className="scheme-surface-containers">
        {(() => {
          const tones = SURFACE_CONTAINER_TONES[mode];
          const palette = theme.palettes.neutral;
          return (
            <>
              <ColorRole name="Lowest" color={palette.tone(tones.lowest)} description="Lowest elevation (e.g., page background)" tokenName="--color-surface-container-lowest" />
              <ColorRole name="Low" color={palette.tone(tones.low)} description="Low elevation (e.g., cards on background)" tokenName="--color-surface-container-low" />
              <ColorRole name="Container" color={palette.tone(tones.default)} description="Default elevated surface" tokenName="--color-surface-container" />
              <ColorRole name="High" color={palette.tone(tones.high)} description="High elevation (e.g., dropdowns)" tokenName="--color-surface-container-high" />
              <ColorRole name="Highest" color={palette.tone(tones.highest)} description="Highest elevation (e.g., modals)" tokenName="--color-surface-container-highest" />
            </>
          );
        })()}
      </div>
      <div className="scheme-surface-extremes">
        {(() => {
          const tones = SURFACE_CONTAINER_TONES[mode];
          const palette = theme.palettes.neutral;
          return (
            <>
              <ColorRole name="Surface Dim" color={palette.tone(tones.dim)} description="Dimmed surface for reduced emphasis" tokenName="--color-surface-dim" />
              <ColorRole name="Surface Bright" color={palette.tone(tones.bright)} description="Bright surface for high emphasis" tokenName="--color-surface-bright" />
            </>
          );
        })()}
      </div>
      
      {/* Inverse Colors */}
      <div className="scheme-section-label">Inverse <span className="section-hint">Inverted colors for snackbars and tooltips</span></div>
      <div className="scheme-inverse">
        <ColorRole name="Inverse Surface" color={scheme.inverseSurface} onColor={scheme.inverseOnSurface} description="Background for inverted contexts (snackbars)" tokenName="--color-inverse-surface" />
        <ColorRole name="Inverse On Surface" color={scheme.inverseOnSurface} description="Text on inverse surface" tokenName="--color-inverse-on-surface" />
        <ColorRole name="Inverse Primary" color={scheme.inversePrimary} description="Primary accent on inverse surface" tokenName="--color-inverse-primary" />
      </div>
    </div>
  );
};

