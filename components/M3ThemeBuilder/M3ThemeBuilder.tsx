import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { 
  generateThemeFromColor, 
  generateThemeWithOverrides,
  generateRandomColor,
  M3Theme,
  argbToHex,
} from '../../themes/m3';
import { SourceColorPicker } from './SourceColorPicker';
import { CoreColorsList } from './CoreColorsList';
import { PalettePreview } from './PalettePreview';
import { SchemePreview } from './SchemePreview';
import { ComponentPreview } from './ComponentPreview';
import { ExportButtons } from './ExportButtons';
import { TypographyPicker } from './TypographyPicker';
import './M3ThemeBuilder.css';

export interface M3ThemeBuilderProps {
  className?: string;
}

export interface CoreColors {
  primary: string;
  secondary: string;
  tertiary: string;
  error: string;
  neutral: string;
  neutralVariant: string;
}

// Custom uploaded image type
export interface CustomImage {
  id: string;
  src: string;
  alt: string;
}

export const M3ThemeBuilder: React.FC<M3ThemeBuilderProps> = ({ className }) => {
  // Source color state
  const [sourceColor, setSourceColor] = useState(() => {
    try {
      const stored = localStorage.getItem('m3-source-color');
      return stored || '#6750A4'; // M3 default purple
    } catch {
      return '#6750A4';
    }
  });
  
  // Custom uploaded images
  const [customImages, setCustomImages] = useState<CustomImage[]>([]);
  
  // Generated theme
  const [theme, setTheme] = useState<M3Theme | null>(null);
  
  // Light/dark mode toggle
  const [mode, setMode] = useState<'light' | 'dark'>('dark');
  
  // Color match toggle (stay true to input colors)
  const [colorMatch, setColorMatch] = useState(false);
  
  // Core color overrides - initialize with default values from initial theme
  const [coreColors, setCoreColors] = useState<CoreColors>(() => {
    try {
      const initialTheme = generateThemeFromColor(
        localStorage.getItem('m3-source-color') || '#6750A4'
      );
      return {
        primary: argbToHex(initialTheme.palettes.primary.tone(40)),
        secondary: argbToHex(initialTheme.palettes.secondary.tone(40)),
        tertiary: argbToHex(initialTheme.palettes.tertiary.tone(40)),
        error: argbToHex(initialTheme.palettes.error.tone(40)),
        neutral: argbToHex(initialTheme.palettes.neutral.tone(40)),
        neutralVariant: argbToHex(initialTheme.palettes.neutralVariant.tone(40)),
      };
    } catch {
      return {
        primary: '#6750A4',
        secondary: '#625B71',
        tertiary: '#7D5260',
        error: '#B3261E',
        neutral: '#605D62',
        neutralVariant: '#605D66',
      };
    }
  });
  
  // Track if core colors have been manually modified
  const [coreColorsModified, setCoreColorsModified] = useState(false);
  
  // Typography settings
  const [typography, setTypography] = useState(() => {
    try {
      return {
        displayFont: localStorage.getItem('m3-display-font') || 'Roboto',
        bodyFont: localStorage.getItem('m3-body-font') || 'Roboto',
      };
    } catch {
      return { displayFont: 'Roboto', bodyFont: 'Roboto' };
    }
  });
  
  // Load Google Fonts dynamically and apply to CSS variables
  useEffect(() => {
    // Remove existing M3 font link if it exists
    const existingLink = document.getElementById('m3-fonts-link');
    if (existingLink) {
      existingLink.remove();
    }

    // Create new link element for Google Fonts
    const link = document.createElement('link');
    link.id = 'm3-fonts-link';
    link.rel = 'stylesheet';
    
    // Build the Google Fonts URL with both fonts
    const fontsToLoad = new Set([typography.displayFont, typography.bodyFont]);
    const fontFamilies = Array.from(fontsToLoad)
      .map(font => `family=${encodeURIComponent(font)}:wght@400;500;600;700`)
      .join('&');
    link.href = `https://fonts.googleapis.com/css2?${fontFamilies}&display=swap`;
    document.head.appendChild(link);

    // Apply fonts to CSS custom properties for the preview
    document.documentElement.style.setProperty(
      '--m3-display-font', 
      `'${typography.displayFont}', -apple-system, BlinkMacSystemFont, sans-serif`
    );
    document.documentElement.style.setProperty(
      '--m3-body-font', 
      `'${typography.bodyFont}', -apple-system, BlinkMacSystemFont, sans-serif`
    );

    // Persist to localStorage
    try {
      localStorage.setItem('m3-display-font', typography.displayFont);
      localStorage.setItem('m3-body-font', typography.bodyFont);
    } catch (error) {
      console.error('Failed to save font preferences:', error);
    }
  }, [typography.displayFont, typography.bodyFont]);
  
  // Generate theme when source color changes (initial generation)
  useEffect(() => {
    try {
      const newTheme = generateThemeFromColor(sourceColor);
      
      // Only set theme directly if we're not in colorMatch mode with modifications
      // (the other useEffect handles that case)
      if (!colorMatch || !coreColorsModified) {
        setTheme(newTheme);
      }
      
      // Extract core colors from generated theme
      // When Color Match is ON and colors are modified, keep user's choices
      // When OFF or not modified, update to harmonious colors from source
      if (!coreColorsModified && !colorMatch) {
        setCoreColors({
          primary: argbToHex(newTheme.palettes.primary.tone(40)),
          secondary: argbToHex(newTheme.palettes.secondary.tone(40)),
          tertiary: argbToHex(newTheme.palettes.tertiary.tone(40)),
          error: argbToHex(newTheme.palettes.error.tone(40)),
          neutral: argbToHex(newTheme.palettes.neutral.tone(40)),
          neutralVariant: argbToHex(newTheme.palettes.neutralVariant.tone(40)),
        });
      } else if (!coreColorsModified) {
        // First load - set initial core colors
        setCoreColors({
          primary: argbToHex(newTheme.palettes.primary.tone(40)),
          secondary: argbToHex(newTheme.palettes.secondary.tone(40)),
          tertiary: argbToHex(newTheme.palettes.tertiary.tone(40)),
          error: argbToHex(newTheme.palettes.error.tone(40)),
          neutral: argbToHex(newTheme.palettes.neutral.tone(40)),
          neutralVariant: argbToHex(newTheme.palettes.neutralVariant.tone(40)),
        });
      }
      
      // Save to localStorage
      localStorage.setItem('m3-source-color', sourceColor);
    } catch (error) {
      console.error('Failed to generate theme:', error);
    }
  }, [sourceColor, coreColorsModified, colorMatch]);
  
  // Regenerate theme when core colors are modified or colorMatch changes
  useEffect(() => {
    // Only run this effect if user has actually modified core colors
    if (!coreColorsModified) return;
    
    try {
      // Apply user's color overrides with colorMatch flag
      // colorMatch=true: use exact colors
      // colorMatch=false: harmonize colors with source
      const newTheme = generateThemeWithOverrides(
        sourceColor, 
        {
          primary: coreColors.primary,
          secondary: coreColors.secondary,
          tertiary: coreColors.tertiary,
          error: coreColors.error,
          neutral: coreColors.neutral,
          neutralVariant: coreColors.neutralVariant,
        },
        colorMatch
      );
      
      setTheme(newTheme);
    } catch (error) {
      console.error('Failed to regenerate theme with overrides:', error);
    }
  }, [coreColors, coreColorsModified, sourceColor, colorMatch]);
  
  // Also regenerate when colorMatch changes even without modifications
  // Note: This only has a visible effect when colors have been manually overridden
  // to values different from what M3 would generate. Auto-generated colors are
  // already harmonious with the source, so harmonizing them again has no effect.
  useEffect(() => {
    if (coreColorsModified) return; // Skip if we have modifications (handled above)
    
    try {
      // Generate theme with current core colors and new colorMatch setting
      const newTheme = generateThemeWithOverrides(
        sourceColor,
        {
          primary: coreColors.primary,
          secondary: coreColors.secondary,
          tertiary: coreColors.tertiary,
          error: coreColors.error,
          neutral: coreColors.neutral,
          neutralVariant: coreColors.neutralVariant,
        },
        colorMatch
      );
      
      setTheme(newTheme);
    } catch (error) {
      console.error('Failed to regenerate theme with colorMatch:', error);
    }
  }, [colorMatch]); // Only trigger on colorMatch change
  
  // Handle source color change
  const handleSourceColorChange = useCallback((color: string) => {
    setSourceColor(color);
    // When Color Match is ON, preserve user's core color choices
    // When OFF, reset to let the system regenerate harmonious colors
    if (!colorMatch) {
      setCoreColorsModified(false);
    }
  }, [colorMatch]);
  
  // Handle custom image upload
  const handleCustomImageAdd = useCallback((imageDataUrl: string) => {
    const newImage: CustomImage = {
      id: `custom-${Date.now()}`,
      src: imageDataUrl,
      alt: 'Custom uploaded image',
    };
    setCustomImages(prev => [...prev, newImage]);
  }, []);
  
  // Handle shuffle
  const handleShuffle = useCallback(() => {
    const randomColor = generateRandomColor();
    setSourceColor(randomColor);
    setCoreColorsModified(false);
  }, []);
  
  // Handle core color override
  const handleCoreColorChange = useCallback((key: keyof CoreColors, value: string) => {
    setCoreColorsModified(true); // Mark as modified
    setCoreColors(prev => prev ? { ...prev, [key]: value } : null);
  }, []);
  
  // Toggle mode
  const toggleMode = useCallback(() => {
    setMode(prev => prev === 'light' ? 'dark' : 'light');
  }, []);
  
  // Handle color match toggle
  // Color Match ON: Use exact colors the user specified (no harmonization)
  // Color Match OFF: Harmonize colors with source color (shift hues towards source)
  const handleColorMatchToggle = useCallback((checked: boolean) => {
    setColorMatch(checked);
    // The useEffect will handle theme regeneration
  }, []);
  
  return (
    <div className={`m3-theme-builder ${className || ''}`}>
      {/* Header */}
      <header className="m3-builder-header">
        <div className="m3-builder-title">
          <h1>Theme Builder</h1>
          <span className="m3-builder-subtitle">M3 Color System</span>
        </div>
        <div className="m3-builder-header-actions">
          <button 
            className={`m3-mode-toggle ${mode}`}
            onClick={toggleMode}
            title={`Switch to ${mode === 'light' ? 'dark' : 'light'} mode`}
          >
            {mode === 'light' ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 3a9 9 0 1 0 9 9c0-.46-.04-.92-.1-1.36a5.389 5.389 0 0 1-4.4 2.26 5.403 5.403 0 0 1-3.14-9.8c-.44-.06-.9-.1-1.36-.1z"/>
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zM2 13h2c.55 0 1-.45 1-1s-.45-1-1-1H2c-.55 0-1 .45-1 1s.45 1 1 1zm18 0h2c.55 0 1-.45 1-1s-.45-1-1-1h-2c-.55 0-1 .45-1 1s.45 1 1 1zM11 2v2c0 .55.45 1 1 1s1-.45 1-1V2c0-.55-.45-1-1-1s-1 .45-1 1zm0 18v2c0 .55.45 1 1 1s1-.45 1-1v-2c0-.55-.45-1-1-1s-1 .45-1 1zM5.99 4.58a.996.996 0 0 0-1.41 0 .996.996 0 0 0 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0s.39-1.03 0-1.41L5.99 4.58zm12.37 12.37a.996.996 0 0 0-1.41 0 .996.996 0 0 0 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0a.996.996 0 0 0 0-1.41l-1.06-1.06zm1.06-10.96a.996.996 0 0 0 0-1.41.996.996 0 0 0-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06zM7.05 18.36a.996.996 0 0 0 0-1.41.996.996 0 0 0-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06z"/>
              </svg>
            )}
          </button>
        </div>
      </header>
      
      {/* Main content - side by side */}
      <div className="m3-builder-content">
        {/* Left Panel - Controls */}
        <aside className="m3-builder-controls">
          <div className="m3-controls-scroll">
            {/* Source Color Section */}
            <section className="m3-section">
              <h2 className="m3-section-title">Source color</h2>
              <p className="m3-section-description">
                Pick a color to generate a complete theme with harmonious palettes.
              </p>
              <SourceColorPicker
                color={sourceColor}
                onChange={handleSourceColorChange}
                onShuffle={handleShuffle}
                customImages={customImages}
                onCustomImageAdd={handleCustomImageAdd}
              />
            </section>
            
            {/* Core Colors Section */}
            <section className="m3-section">
              <h2 className="m3-section-title">Core colors</h2>
              <p className="m3-section-description">
                Override key colors to generate tonal palettes and schemes.
              </p>
              <label className="m3-checkbox">
                <input
                  type="checkbox"
                  checked={colorMatch}
                  onChange={(e) => handleColorMatchToggle(e.target.checked)}
                />
                <span>Color match</span>
                <span className="m3-checkbox-hint">
                  {colorMatch 
                    ? 'Using exact colors you specify' 
                    : 'Harmonizing colors with source'}
                </span>
              </label>
              <CoreColorsList
                colors={coreColors}
                onChange={handleCoreColorChange}
              />
            </section>
            
            {/* Typography Section */}
            <section className="m3-section">
              <h2 className="m3-section-title">Typography</h2>
              <TypographyPicker
                displayFont={typography.displayFont}
                bodyFont={typography.bodyFont}
                onDisplayFontChange={(font) => setTypography(prev => ({ ...prev, displayFont: font }))}
                onBodyFontChange={(font) => setTypography(prev => ({ ...prev, bodyFont: font }))}
              />
            </section>
            
            {/* Export Section */}
            <section className="m3-section">
              <h2 className="m3-section-title">Export</h2>
              {theme && <ExportButtons theme={theme} />}
            </section>
          </div>
        </aside>
        
        {/* Right Panel - Preview */}
        <main className="m3-builder-preview">
          {theme && (
            <>
              {/* Component Preview */}
              <section className="m3-preview-section">
                <ComponentPreview theme={theme} mode={mode} typography={typography} />
              </section>
              
              {/* Scheme Preview */}
              <section className="m3-preview-section">
                <SchemePreview theme={theme} mode={mode} />
              </section>
              
              {/* Tonal Palettes */}
              <section className="m3-preview-section">
                <h3 className="m3-preview-title">Tonal Palettes</h3>
                <PalettePreview theme={theme} />
              </section>
            </>
          )}
        </main>
      </div>
    </div>
  );
};

