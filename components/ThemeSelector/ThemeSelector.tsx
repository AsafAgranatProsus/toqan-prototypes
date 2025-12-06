import React, { useState, useEffect, useCallback } from 'react';
import Dropdown from '../Dropdown/Dropdown';
import { Icons } from '../Icons/Icons';
import { loadThemeManifest, loadTheme, ThemeMetadata } from '../../themes/colors';
import './ThemeSelector.css';

interface ThemeSelectorProps {
  /** Size variant for the dropdown */
  size?: 'tight' | 'normal' | 'large';
  /** Custom className */
  className?: string;
  /** Show theme descriptions */
  showDescriptions?: boolean;
  /** Callback when theme changes */
  onThemeChange?: (theme: ThemeMetadata) => void;
}

/**
 * ThemeSelector - Dropdown component for selecting color themes
 * 
 * Loads available themes from the theme manifest and allows
 * users to switch between them. Automatically persists selection
 * to localStorage.
 * 
 * Features:
 * - Loads themes from theme manifest
 * - Shows theme previews with source color
 * - Optional theme descriptions
 * - Persists selection to localStorage
 * - Integrates with the theme loading system
 */
export const ThemeSelector: React.FC<ThemeSelectorProps> = ({
  size = 'normal',
  className = '',
  showDescriptions = true,
  onThemeChange,
}) => {
  const [themes, setThemes] = useState<ThemeMetadata[]>([]);
  const [currentTheme, setCurrentTheme] = useState<ThemeMetadata | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isApplying, setIsApplying] = useState(false);

  // Load available themes on mount
  useEffect(() => {
    loadThemeManifest()
      .then(loadedThemes => {
        setThemes(loadedThemes);
        
        // Determine current theme from localStorage
        const savedThemeFilename = localStorage.getItem('toqan-selected-theme');
        const current = savedThemeFilename
          ? loadedThemes.find(t => t.filename === savedThemeFilename)
          : loadedThemes.find(t => t.isDefault) || loadedThemes[0];
        
        setCurrentTheme(current || null);
      })
      .catch(err => {
        console.error('Failed to load themes:', err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  // Handle theme selection
  const handleThemeSelect = useCallback(async (theme: ThemeMetadata) => {
    if (theme.id === currentTheme?.id) return;
    
    setIsApplying(true);
    
    try {
      await loadTheme(theme);
      setCurrentTheme(theme);
      onThemeChange?.(theme);
    } catch (error) {
      console.error('Failed to apply theme:', error);
    } finally {
      setIsApplying(false);
    }
  }, [currentTheme, onThemeChange]);

  return (
    <Dropdown
      size={size}
      className={`theme-selector ${className}`}
      icon={<Icons name="Layout" />}
    >
      <Dropdown.Trigger>
        {isLoading ? 'Loading themes...' : currentTheme?.name || 'Select Theme'}
      </Dropdown.Trigger>
      
      <Dropdown.Menu>
        {themes.length === 0 ? (
          <div className="theme-selector__empty">No themes available</div>
        ) : (
          themes.map((theme) => (
            <Dropdown.Item
              key={theme.id}
              onClick={() => handleThemeSelect(theme)}
              isSelected={theme.id === currentTheme?.id}
              disabled={isApplying}
            >
              <div className="theme-selector__item">
                <div className="theme-selector__item-header">
                  {/* Color preview swatch */}
                  {theme.sourceColor && (
                    <div
                      className="theme-selector__color-preview"
                      style={{ backgroundColor: theme.sourceColor }}
                      aria-hidden="true"
                    />
                  )}
                  
                  <div className="theme-selector__item-content">
                    <span className="theme-selector__item-name">
                      {theme.name}
                      {theme.isDefault && (
                        <span className="theme-selector__badge">Default</span>
                      )}
                    </span>
                    
                    {showDescriptions && theme.description && (
                      <span className="theme-selector__item-description">
                        {theme.description}
                      </span>
                    )}
                  </div>
                </div>
                
                {/* Optional metadata */}
                {theme.author && (
                  <span className="theme-selector__item-meta">
                    by {theme.author}
                  </span>
                )}
              </div>
            </Dropdown.Item>
          ))
        )}
      </Dropdown.Menu>
    </Dropdown>
  );
};
