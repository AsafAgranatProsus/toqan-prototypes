import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { 
  generateThemeFromColor, 
  generateThemeWithOverrides,
  generateRandomColor,
  M3Theme,
  argbToHex,
  CONTRAST_STANDARD,
  CONTRAST_MEDIUM,
  CONTRAST_HIGH,
} from '../../themes/m3';
import { loadThemeManifest, ThemeMetadata } from '../../themes/colors';
import { SourceColorPicker } from './SourceColorPicker';
import { CoreColorsList } from './CoreColorsList';
import { ExtendedColorsList } from './ExtendedColorsList';
import { PalettePreview } from './PalettePreview';
import { SchemePreview } from './SchemePreview';
import { ComponentPreview } from './ComponentPreview';
import { ExportButtons } from './ExportButtons';
import { TypographyPicker } from './TypographyPicker';
import { CustomSelect } from './CustomSelect';
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

// Extended color type
export interface ExtendedColor {
  id: string;
  name: string;
  description?: string;
  color: string;
  blend: boolean;
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
  
  // Contrast level (0 = standard, 0.5 = medium, 1 = high)
  const [contrastLevel, setContrastLevel] = useState(() => {
    try {
      const stored = localStorage.getItem('m3-contrast-level');
      return stored ? parseFloat(stored) : CONTRAST_STANDARD;
    } catch {
      return CONTRAST_STANDARD;
    }
  });
  
  // Core color overrides - initialize with default values from initial theme
  // Primary = source color (exactly), others = keyColor from palette
  const [coreColors, setCoreColors] = useState<CoreColors>(() => {
    try {
      const initialSourceColor = localStorage.getItem('m3-source-color') || '#6750A4';
      const initialTheme = generateThemeFromColor(initialSourceColor);
      return {
        primary: initialSourceColor, // Primary always equals source color exactly
        secondary: argbToHex(initialTheme.palettes.secondary.keyColor.toInt()),
        tertiary: argbToHex(initialTheme.palettes.tertiary.keyColor.toInt()),
        error: argbToHex(initialTheme.palettes.error.keyColor.toInt()),
        neutral: argbToHex(initialTheme.palettes.neutral.keyColor.toInt()),
        neutralVariant: argbToHex(initialTheme.palettes.neutralVariant.keyColor.toInt()),
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
  
  // Extended colors state
  const [extendedColors, setExtendedColors] = useState<ExtendedColor[]>(() => {
    try {
      const stored = localStorage.getItem('m3-extended-colors');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });
  
  // Theme name for export
  const [themeName, setThemeName] = useState(() => {
    try {
      return localStorage.getItem('m3-theme-name') || 'Custom Theme';
    } catch {
      return 'Custom Theme';
    }
  });
  
  // Persist theme name
  useEffect(() => {
    try {
      localStorage.setItem('m3-theme-name', themeName);
    } catch (error) {
      console.error('Failed to save theme name:', error);
    }
  }, [themeName]);
  
  // Persist extended colors to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('m3-extended-colors', JSON.stringify(extendedColors));
    } catch (error) {
      console.error('Failed to save extended colors:', error);
    }
  }, [extendedColors]);
  
  // Extended colors handlers
  const handleAddExtendedColor = useCallback(() => {
    const newColor: ExtendedColor = {
      id: `extended-${Date.now()}`,
      name: `Custom ${extendedColors.length + 1}`,
      color: '#6750A4',
      blend: true,
    };
    setExtendedColors(prev => [...prev, newColor]);
  }, [extendedColors.length]);
  
  const handleUpdateExtendedColor = useCallback((id: string, updates: Partial<ExtendedColor>) => {
    setExtendedColors(prev => 
      prev.map(color => color.id === id ? { ...color, ...updates } : color)
    );
  }, []);
  
  const handleDeleteExtendedColor = useCallback((id: string) => {
    setExtendedColors(prev => prev.filter(color => color.id !== id));
  }, []);
  
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
  
  // Generate theme when source color or contrast level changes (initial generation)
  useEffect(() => {
    try {
      const newTheme = generateThemeFromColor(sourceColor, contrastLevel);
      
      // Only set theme directly if we're not in colorMatch mode with modifications
      // (the other useEffect handles that case)
      if (!colorMatch || !coreColorsModified) {
        setTheme(newTheme);
      }
      
      // Extract core colors from generated theme
      // When Color Match is ON and colors are modified, keep user's choices
      // When OFF or not modified, update to harmonious colors from source
      // Primary = source color (exactly), others = keyColor from palette
      if (!coreColorsModified && !colorMatch) {
        setCoreColors({
          primary: sourceColor, // Primary always equals source color exactly
          secondary: argbToHex(newTheme.palettes.secondary.keyColor.toInt()),
          tertiary: argbToHex(newTheme.palettes.tertiary.keyColor.toInt()),
          error: argbToHex(newTheme.palettes.error.keyColor.toInt()),
          neutral: argbToHex(newTheme.palettes.neutral.keyColor.toInt()),
          neutralVariant: argbToHex(newTheme.palettes.neutralVariant.keyColor.toInt()),
        });
      } else if (!coreColorsModified) {
        // First load - set initial core colors
        setCoreColors({
          primary: sourceColor, // Primary always equals source color exactly
          secondary: argbToHex(newTheme.palettes.secondary.keyColor.toInt()),
          tertiary: argbToHex(newTheme.palettes.tertiary.keyColor.toInt()),
          error: argbToHex(newTheme.palettes.error.keyColor.toInt()),
          neutral: argbToHex(newTheme.palettes.neutral.keyColor.toInt()),
          neutralVariant: argbToHex(newTheme.palettes.neutralVariant.keyColor.toInt()),
        });
      }
      
      // Save to localStorage
      localStorage.setItem('m3-source-color', sourceColor);
      localStorage.setItem('m3-contrast-level', contrastLevel.toString());
    } catch (error) {
      console.error('Failed to generate theme:', error);
    }
  }, [sourceColor, coreColorsModified, colorMatch, contrastLevel]);
  
  // Regenerate theme when core colors are modified or colorMatch changes
  useEffect(() => {
    // Only run this effect if user has actually modified core colors
    if (!coreColorsModified) return;
    
    try {
      // Apply user's color overrides with colorMatch flag and contrast level
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
        colorMatch,
        contrastLevel
      );
      
      setTheme(newTheme);
    } catch (error) {
      console.error('Failed to regenerate theme with overrides:', error);
    }
  }, [coreColors, coreColorsModified, sourceColor, colorMatch, contrastLevel]);
  
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
        colorMatch,
        contrastLevel
      );
      
      setTheme(newTheme);
    } catch (error) {
      console.error('Failed to regenerate theme with colorMatch:', error);
    }
  }, [colorMatch, contrastLevel]); // Trigger on colorMatch or contrast change
  
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
  
  // Available themes from manifest
  const [availableThemes, setAvailableThemes] = useState<ThemeMetadata[]>([]);
  const [isLoadingThemes, setIsLoadingThemes] = useState(true);
  
  // Load themes from manifest on mount
  useEffect(() => {
    loadThemeManifest()
      .then(themes => {
        setAvailableThemes(themes);
        setIsLoadingThemes(false);
      })
      .catch(err => {
        console.error('Failed to load theme manifest:', err);
        setIsLoadingThemes(false);
      });
  }, []);
  
  // Handle loading a theme from the manifest
  const handleLoadTheme = useCallback((themeId: string) => {
    const selectedTheme = availableThemes.find(t => t.id === themeId);
    if (!selectedTheme) return;
    
    // Set source color (most important for regeneration)
    if (selectedTheme.sourceColor) {
      setSourceColor(selectedTheme.sourceColor);
    }
    
    // Set theme name
    setThemeName(selectedTheme.name);
    
    // Set typography
    setTypography({
      displayFont: selectedTheme.displayFont || 'Roboto',
      bodyFont: selectedTheme.bodyFont || 'Roboto',
    });
    
    // Set contrast level
    if (typeof selectedTheme.contrastLevel === 'number') {
      setContrastLevel(selectedTheme.contrastLevel);
    } else {
      setContrastLevel(CONTRAST_STANDARD);
    }
    
    // Set color match
    setColorMatch(selectedTheme.colorMatch || false);
    
    // Set core colors if saved
    if (selectedTheme.coreColors) {
      setCoreColors({
        primary: selectedTheme.coreColors.primary || selectedTheme.sourceColor || '#6750A4',
        secondary: selectedTheme.coreColors.secondary || '#625B71',
        tertiary: selectedTheme.coreColors.tertiary || '#7D5260',
        error: selectedTheme.coreColors.error || '#B3261E',
        neutral: selectedTheme.coreColors.neutral || '#605D62',
        neutralVariant: selectedTheme.coreColors.neutralVariant || '#605D66',
      });
      setCoreColorsModified(true);
    } else {
      // Reset to let system regenerate from source
      setCoreColorsModified(false);
    }
    
    // Set extended colors if saved
    if (selectedTheme.extendedColors && selectedTheme.extendedColors.length > 0) {
      setExtendedColors(selectedTheme.extendedColors.map(c => ({
        id: c.id,
        name: c.name,
        description: c.description,
        color: c.color,
        blend: c.blend,
      })));
    } else {
      setExtendedColors([]);
    }
    
  }, [availableThemes]);
  
  return (
    <div className={`m3-theme-builder ${className || ''}`}>
      {/* Header */}
      <header className="m3-builder-header">
        <div className="m3-builder-title">
          <h1>Toqan Theme Builder</h1>
          {/* <span className="m3-builder-subtitle">Harmonic Color System</span> */}
        </div>
        <div className="m3-builder-header-actions">
          {/* Contrast Level Selector */}
          <div className="m3-contrast-selector" role="group" aria-label="Contrast level">
            <button
              className={`m3-contrast-btn ${contrastLevel === CONTRAST_STANDARD ? 'active' : ''}`}
              onClick={() => setContrastLevel(CONTRAST_STANDARD)}
              title="Standard contrast"
              aria-pressed={contrastLevel === CONTRAST_STANDARD}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <circle cx="12" cy="12" r="8" fill="none" stroke="currentColor" strokeWidth="2"/>
                <path d="M12 4v16" stroke="currentColor" strokeWidth="2"/>
                <path d="M12 4a8 8 0 0 1 0 16" fill="currentColor"/>
              </svg>
            </button>
            <button
              className={`m3-contrast-btn ${contrastLevel === CONTRAST_MEDIUM ? 'active' : ''}`}
              onClick={() => setContrastLevel(CONTRAST_MEDIUM)}
              title="Medium contrast"
              aria-pressed={contrastLevel === CONTRAST_MEDIUM}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <circle cx="12" cy="12" r="8" fill="none" stroke="currentColor" strokeWidth="2"/>
                <path d="M12 4v16" stroke="currentColor" strokeWidth="2"/>
                <path d="M12 4a8 8 0 0 1 0 16" fill="currentColor"/>
                <circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" strokeWidth="1.5"/>
              </svg>
            </button>
            <button
              className={`m3-contrast-btn ${contrastLevel === CONTRAST_HIGH ? 'active' : ''}`}
              onClick={() => setContrastLevel(CONTRAST_HIGH)}
              title="High contrast"
              aria-pressed={contrastLevel === CONTRAST_HIGH}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <circle cx="12" cy="12" r="8" fill="none" stroke="currentColor" strokeWidth="2.5"/>
                <path d="M12 4v16" stroke="currentColor" strokeWidth="2.5"/>
                <path d="M12 4a8 8 0 0 1 0 16" fill="currentColor"/>
              </svg>
            </button>
          </div>
          
          {/* Mode Toggle */}
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
            {/* Load Theme Section */}
            <section className="m3-section m3-section-load">
              <h2 className="m3-section-title">Load theme</h2>
              <CustomSelect
                value=""
                onChange={handleLoadTheme}
                placeholder={isLoadingThemes ? 'Loading themes...' : 'Select a saved theme...'}
                disabled={isLoadingThemes}
                options={availableThemes
                  .filter(t => t.sourceColor)
                  .map(theme => ({
                    value: theme.id,
                    label: theme.name,
                  }))
                }
              />
            </section>
            
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
            
            {/* Extended Colors Section */}
            <section className="m3-section">
              <ExtendedColorsList
                colors={extendedColors}
                sourceColor={sourceColor}
                onAdd={handleAddExtendedColor}
                onUpdate={handleUpdateExtendedColor}
                onDelete={handleDeleteExtendedColor}
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
              {theme && (
                <ExportButtons 
                  theme={theme} 
                  extendedColors={extendedColors} 
                  sourceColor={sourceColor}
                  themeName={themeName}
                  onThemeNameChange={setThemeName}
                  displayFont={typography.displayFont}
                  bodyFont={typography.bodyFont}
                  contrastLevel={contrastLevel}
                  colorMatch={colorMatch}
                  coreColors={coreColors}
                  coreColorsModified={coreColorsModified}
                />
              )}
            </section>
          </div>
        </aside>
        
        {/* Right Panel - Preview - uses theme colors for true WYSIWYG */}
        <main 
          className={`m3-builder-preview ${mode}`}
          style={theme ? {
            backgroundColor: argbToHex(mode === 'light' 
              ? theme.palettes.neutral.tone(98) 
              : theme.palettes.neutral.tone(6)),
            color: argbToHex(mode === 'light'
              ? theme.schemes.light.onBackground
              : theme.schemes.dark.onBackground),
          } : undefined}
        >
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
                <PalettePreview theme={theme} extendedColors={extendedColors} sourceColor={sourceColor} />
              </section>
            </>
          )}
        </main>
      </div>
    </div>
  );
};

