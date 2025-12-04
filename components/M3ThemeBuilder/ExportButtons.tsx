import React, { useState, useMemo } from 'react';
import { M3Theme, exportThemeAsCSS, exportThemeAsJSON, exportThemeAsAppCSS, generateExtendedColorPalettes, ExtendedColorInput } from '../../themes/m3';
import { ExtendedColor } from './M3ThemeBuilder';
import { clearThemeCache } from '../../themes/colors';
import './ExportButtons.css';

export interface CoreColors {
  primary: string;
  secondary: string;
  tertiary: string;
  error: string;
  neutral: string;
  neutralVariant: string;
}

export interface ExportButtonsProps {
  theme: M3Theme;
  extendedColors?: ExtendedColor[];
  sourceColor?: string;
  themeName: string;
  onThemeNameChange: (name: string) => void;
  displayFont?: string;
  bodyFont?: string;
  contrastLevel?: number;
  colorMatch?: boolean;
  coreColors?: CoreColors;
  coreColorsModified?: boolean;
}

// Check if we're in development mode (API available)
const isDev = import.meta.env.DEV;

/**
 * Convert theme name to filename-safe format
 */
function toFilename(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '') || 'custom-theme';
}

export const ExportButtons: React.FC<ExportButtonsProps> = ({ 
  theme,
  extendedColors = [],
  sourceColor = '#6750A4',
  themeName,
  onThemeNameChange,
  displayFont,
  bodyFont,
  contrastLevel = 0,
  colorMatch = false,
  coreColors,
  coreColorsModified = false,
}) => {
  const [copied, setCopied] = useState<'css' | 'json' | 'app' | 'manifest' | null>(null);
  const [savedToLibrary, setSavedToLibrary] = useState(false);
  const [showManifestEntry, setShowManifestEntry] = useState(false);
  
  // Generate extended color palettes for export
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
  
  // Primary export - App Theme format
  const handleExportAppTheme = () => {
    const css = exportThemeAsAppCSS(theme, themeName, sourceColor, extendedPalettes);
    const blob = new Blob([css], { type: 'text/css' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${toFilename(themeName)}.css`;
    a.click();
    URL.revokeObjectURL(url);
  };
  
  const handleCopyAppTheme = async () => {
    const css = exportThemeAsAppCSS(theme, themeName, sourceColor, extendedPalettes);
    await navigator.clipboard.writeText(css);
    setCopied('app');
    setTimeout(() => setCopied(null), 2000);
  };
  
  // M3 format exports (secondary)
  const handleExportCSS = async () => {
    const css = exportThemeAsCSS(theme, extendedPalettes);
    await navigator.clipboard.writeText(css);
    setCopied('css');
    setTimeout(() => setCopied(null), 2000);
  };
  
  const handleExportJSON = async () => {
    const json = exportThemeAsJSON(theme, extendedPalettes);
    await navigator.clipboard.writeText(json);
    setCopied('json');
    setTimeout(() => setCopied(null), 2000);
  };
  
  const handleDownloadCSS = () => {
    const css = exportThemeAsCSS(theme, extendedPalettes);
    const blob = new Blob([css], { type: 'text/css' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${toFilename(themeName)}-m3.css`;
    a.click();
    URL.revokeObjectURL(url);
  };
  
  const handleDownloadJSON = () => {
    const json = exportThemeAsJSON(theme, extendedPalettes);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${toFilename(themeName)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };
  
  // Generate manifest entry for the theme
  const manifestEntry = useMemo(() => {
    const filename = `${toFilename(themeName)}.css`;
    const entry: Record<string, any> = {
      id: toFilename(themeName),
      name: themeName || 'Custom Theme',
      description: `Theme generated from source color ${sourceColor}`,
      sourceColor,
      filename,
    };
    // Include fonts if they're not defaults
    if (displayFont && displayFont !== 'Roboto') {
      entry.displayFont = displayFont;
    }
    if (bodyFont && bodyFont !== 'Roboto') {
      entry.bodyFont = bodyFont;
    }
    // Include contrast level if not standard
    if (contrastLevel !== 0) {
      entry.contrastLevel = contrastLevel;
    }
    // Include colorMatch if enabled
    if (colorMatch) {
      entry.colorMatch = colorMatch;
    }
    // Include core color overrides if modified
    if (coreColorsModified && coreColors) {
      entry.coreColors = {
        primary: coreColors.primary,
        secondary: coreColors.secondary,
        tertiary: coreColors.tertiary,
        error: coreColors.error,
        neutral: coreColors.neutral,
        neutralVariant: coreColors.neutralVariant,
      };
    }
    // Include extended colors if any
    if (extendedColors.length > 0) {
      entry.extendedColors = extendedColors.map(c => ({
        id: c.id,
        name: c.name,
        description: c.description,
        color: c.color,
        blend: c.blend,
      }));
    }
    return entry;
  }, [themeName, sourceColor, displayFont, bodyFont, contrastLevel, colorMatch, coreColors, coreColorsModified, extendedColors]);
  
  // Copy manifest entry to clipboard
  const handleCopyManifestEntry = async () => {
    const json = JSON.stringify(manifestEntry, null, 2);
    await navigator.clipboard.writeText(json);
    setCopied('manifest');
    setTimeout(() => setCopied(null), 2000);
  };
  
  // Save to library using dev API
  const handleSaveToLibrary = async () => {
    if (!isDev) {
      // In production, just download the file and show instructions
      handleExportAppTheme();
      setShowManifestEntry(true);
      return;
    }
    
    try {
      const css = exportThemeAsAppCSS(theme, themeName, sourceColor, extendedPalettes);
      
      // Call dev server API to save the file and update manifest
      const response = await fetch('/api/save-theme', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          css,
          manifest: manifestEntry,
        }),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to save theme');
      }
      
      // Clear the theme cache so new themes are loaded
      clearThemeCache();
      
      setSavedToLibrary(true);
      setShowManifestEntry(false); // Don't need to show manifest - it's auto-updated
      setTimeout(() => setSavedToLibrary(false), 3000);
    } catch (err) {
      console.error('Failed to save theme:', err);
      // Fallback to download
      handleExportAppTheme();
      setShowManifestEntry(true);
    }
  };
  
  return (
    <div className="export-buttons">
      {/* Theme Name Input */}
      <div className="export-theme-name">
        <label htmlFor="theme-name">Theme Name</label>
        <input
          id="theme-name"
          type="text"
          value={themeName}
          onChange={(e) => onThemeNameChange(e.target.value)}
          placeholder="My Custom Theme"
        />
      </div>
      
      {/* Primary Export - Save to Library */}
      <div className="export-section">
        <div className="export-section-title">Save to Library</div>
        <div className="export-row">
          <button 
            className={`export-btn primary ${savedToLibrary ? 'success' : ''}`} 
            onClick={handleSaveToLibrary}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V7l-4-4zm-5 16c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm3-10H5V5h10v4z"/>
            </svg>
            {savedToLibrary ? 'Saved!' : 'Save to Library'}
          </button>
        </div>
        <p className="export-hint">
          {isDev 
            ? 'Saves to public/themes/ and updates manifest automatically' 
            : 'Downloads the theme file (manual setup required)'}
        </p>
      </div>
      
      {/* Manifest Entry (shown after download in production) */}
      {showManifestEntry && (
        <div className="export-section manifest-section">
          <div className="export-section-title">Manual Setup Required</div>
          <p className="export-hint" style={{ marginBottom: '8px' }}>
            1. Save the downloaded CSS to <code>public/themes/</code>
          </p>
          <p className="export-hint" style={{ marginBottom: '8px' }}>
            2. Add this entry to <code>themes.json</code>:
          </p>
          <pre className="manifest-entry">
            {JSON.stringify(manifestEntry, null, 2)}
          </pre>
          <button className="export-btn" onClick={handleCopyManifestEntry}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/>
            </svg>
            {copied === 'manifest' ? 'Copied!' : 'Copy Entry'}
          </button>
        </div>
      )}
      
      {/* Secondary Export - Download */}
      <div className="export-section">
        <div className="export-section-title">Export for Toqan</div>
        <div className="export-row">
          <button className="export-btn" onClick={handleExportAppTheme}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/>
            </svg>
            Download Theme
          </button>
          <button className="export-btn" onClick={handleCopyAppTheme}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/>
            </svg>
            {copied === 'app' ? 'Copied!' : 'Copy'}
          </button>
        </div>
      </div>
      
      {/* Secondary Exports - M3 Format */}
      <details className="export-advanced">
        <summary>Advanced (M3 Format)</summary>
        <div className="export-section">
          <div className="export-row">
            <button className="export-btn" onClick={handleExportCSS}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/>
              </svg>
              {copied === 'css' ? 'Copied!' : 'Copy M3 CSS'}
            </button>
            <button className="export-btn secondary" onClick={handleDownloadCSS}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/>
              </svg>
              Download
            </button>
          </div>
          
          <div className="export-row">
            <button className="export-btn" onClick={handleExportJSON}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/>
              </svg>
              {copied === 'json' ? 'Copied!' : 'Copy JSON'}
            </button>
            <button className="export-btn secondary" onClick={handleDownloadJSON}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/>
              </svg>
              Download
            </button>
          </div>
        </div>
      </details>
    </div>
  );
};

