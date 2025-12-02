import React from 'react';
import { M3Theme, argbToHex, Scheme } from '../../themes/m3';
import './SchemePreview.css';

export interface SchemePreviewProps {
  theme: M3Theme;
  mode: 'light' | 'dark';
}

interface ColorRoleProps {
  name: string;
  color: number;
  onColor?: number;
}

const ColorRole: React.FC<ColorRoleProps> = ({ name, color, onColor }) => {
  const bgHex = argbToHex(color);
  const textHex = onColor ? argbToHex(onColor) : undefined;
  
  return (
    <div 
      className="color-role"
      style={{ 
        backgroundColor: bgHex,
        color: textHex || (isLightColor(bgHex) ? '#000' : '#fff'),
      }}
      title={`${name}: ${bgHex}`}
    >
      <span className="color-role-name">{name}</span>
      <span className="color-role-value">{bgHex}</span>
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
            { name: 'Primary', color: scheme.primary },
            { name: 'Secondary', color: scheme.secondary },
            { name: 'Tertiary', color: scheme.tertiary },
            { name: 'Error', color: scheme.error },
          ].map((item) => (
            <ColorRole key={item.name} {...item} />
          ))}
        </div>
        
        <div className="scheme-row scheme-row-on">
          {[
            { name: 'On Primary', color: scheme.onPrimary },
            { name: 'On Secondary', color: scheme.onSecondary },
            { name: 'On Tertiary', color: scheme.onTertiary },
            { name: 'On Error', color: scheme.onError },
          ].map((item) => (
            <ColorRole key={item.name} {...item} />
          ))}
        </div>
        
        <div className="scheme-row scheme-row-container">
          {[
            { name: 'Primary Container', color: scheme.primaryContainer },
            { name: 'Secondary Container', color: scheme.secondaryContainer },
            { name: 'Tertiary Container', color: scheme.tertiaryContainer },
            { name: 'Error Container', color: scheme.errorContainer },
          ].map((item) => (
            <ColorRole key={item.name} {...item} />
          ))}
        </div>
        
        <div className="scheme-row scheme-row-on-container">
          {[
            { name: 'On Primary Container', color: scheme.onPrimaryContainer },
            { name: 'On Secondary Container', color: scheme.onSecondaryContainer },
            { name: 'On Tertiary Container', color: scheme.onTertiaryContainer },
            { name: 'On Error Container', color: scheme.onErrorContainer },
          ].map((item) => (
            <ColorRole key={item.name} {...item} />
          ))}
        </div>
      </div>
      
      <div className="scheme-surfaces">
        <div className="scheme-surface-row">
          <ColorRole name="Background" color={scheme.background} />
          <ColorRole name="Surface" color={scheme.surface} />
          <ColorRole name="Surface Variant" color={scheme.surfaceVariant} />
        </div>
        <div className="scheme-surface-row">
          <ColorRole name="Outline" color={scheme.outline} />
          <ColorRole name="Outline Variant" color={scheme.outlineVariant} />
        </div>
      </div>
    </div>
  );
};

