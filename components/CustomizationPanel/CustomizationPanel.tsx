import React, { useState, useRef, useEffect } from 'react';
import { TokenControl } from './TokenControl';
import { TypographySystemControl } from './TypographySystemControl';
import { getTokensByCategory, tokenCategories } from '../../themes/tokenMetadata';
import { useThemeCustomization } from '../../context/ThemeCustomizationContext';
import { useDesignSystem } from '../../context/DesignSystemContext';
import { getBaseThemeIds } from '../../themes/baseThemes';
import { Icons } from '../Icons/Icons';
import './CustomizationPanel.css';

export interface CustomizationPanelProps {
  isOpen: boolean;
  onToggle: () => void;
}

/**
 * Main customization panel component
 */
export const CustomizationPanel: React.FC<CustomizationPanelProps> = ({ isOpen, onToggle }) => {
  const {
    baseTheme,
    isCustomized,
    resetToBase,
    switchBaseTheme,
    saveAsCustomTheme,
    loadCustomTheme,
    deleteCustomTheme,
    exportTheme,
    importTheme,
    customThemes,
    activeTheme,
  } = useThemeCustomization();
  
  const { themeMode, toggleTheme } = useDesignSystem();
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [themeName, setThemeName] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const tokensByCategory = getTokensByCategory(showAdvanced);
  
  // Keyboard shortcut: Alt/Cmd + \
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.altKey || e.metaKey) && e.key === '\\') {
        e.preventDefault();
        onToggle();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onToggle]);
  
  // Prevent scroll leaking when panel is scrolled to top/bottom
  useEffect(() => {
    const panel = document.querySelector('.customization-panel-content');
    if (!panel) return;
    
    const handleWheel = (e: WheelEvent) => {
      const { scrollTop, scrollHeight, clientHeight } = panel as HTMLElement;
      const isScrollingDown = e.deltaY > 0;
      const isScrollingUp = e.deltaY < 0;
      
      // Prevent scroll leak at top
      if (isScrollingUp && scrollTop === 0) {
        e.preventDefault();
      }
      
      // Prevent scroll leak at bottom
      if (isScrollingDown && scrollTop + clientHeight >= scrollHeight) {
        e.preventDefault();
      }
    };
    
    panel.addEventListener('wheel', handleWheel, { passive: false });
    return () => panel.removeEventListener('wheel', handleWheel);
  }, [isOpen]);
  
  const handleExport = () => {
    const json = exportTheme();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${activeTheme?.name || 'theme'}-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };
  
  const handleImportClick = () => {
    fileInputRef.current?.click();
  };
  
  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
      const json = event.target?.result as string;
      const success = importTheme(json);
      if (success) {
        alert('Theme imported successfully!');
      } else {
        alert('Failed to import theme. Please check the file format.');
      }
    };
    reader.readAsText(file);
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  const handleSave = () => {
    if (themeName.trim()) {
      saveAsCustomTheme(themeName.trim());
      setShowSaveDialog(false);
      setThemeName('');
    }
  };
  
  const handleLoadCustomTheme = (themeId: string) => {
    loadCustomTheme(themeId);
  };
  
  const handleDeleteCustomTheme = (themeId: string) => {
    if (confirm('Are you sure you want to delete this theme?')) {
      deleteCustomTheme(themeId);
    }
  };
  
  return (
    <>
      {/* Panel */}
      <div className={`customization-panel ${isOpen ? 'open' : ''}`}>
        <div className="customization-panel-header">
          <div className="customization-panel-header-top">
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <h2 className="customization-panel-title">Theme Customization</h2>
              <button
                className="customization-panel-mode-badge"
                onClick={toggleTheme}
                title={`Switch to ${themeMode === 'dark' ? 'light' : 'dark'} mode`}
              >
                <Icons name={themeMode === 'dark' ? 'Moon' : 'Sun'} />
                <span>{themeMode === 'dark' ? 'Dark' : 'Light'}</span>
              </button>
            </div>
            <button
              className="customization-close-button"
              onClick={onToggle}
              title="Close panel (Alt+\)"
            >
              <Icons name="X" />
            </button>
          </div>
          
          {/* Action Buttons in Header */}
          <div className="customization-panel-header-actions">
            <button
              onClick={resetToBase}
              disabled={!isCustomized}
              className="customization-button secondary"
              title="Reset all customizations to base theme"
            >
              <Icons name="RotateCcw" />
              Reset
            </button>
            
            <button
              onClick={() => setShowSaveDialog(true)}
              disabled={!isCustomized}
              className="customization-button secondary"
              title="Save current customizations as a new theme"
            >
              <Icons name="Save" />
              Save
            </button>
            
            <button
              onClick={handleExport}
              className="customization-button secondary"
              title="Export theme as JSON"
            >
              <Icons name="Download" />
              Export
            </button>
            
            <button
              onClick={handleImportClick}
              className="customization-button secondary"
              title="Import theme from JSON"
            >
              <Icons name="Upload" />
              Import
            </button>
            
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleImportFile}
              style={{ display: 'none' }}
            />
          </div>
        </div>
        
        <div className="customization-panel-content">
          {/* Base Theme Selector */}
          <div className="customization-section">
            <label className="customization-label">Base Theme</label>
            <select
              value={baseTheme?.id || ''}
              onChange={(e) => switchBaseTheme(e.target.value)}
              className="customization-select"
            >
              {getBaseThemeIds().map(id => {
                const theme = baseTheme?.id === id ? baseTheme : { id, name: id };
                return (
                  <option key={id} value={id}>
                    {theme.name || id}
                  </option>
                );
              })}
            </select>
          </div>
          
          {/* Custom Themes */}
          {customThemes.length > 0 && (
            <div className="customization-section">
              <label className="customization-label">Saved Themes</label>
              <div className="customization-theme-list">
                {customThemes.map(theme => (
                  <div
                    key={theme.id}
                    className={`customization-theme-item ${activeTheme?.id === theme.id ? 'active' : ''}`}
                  >
                    <button
                      onClick={() => handleLoadCustomTheme(theme.id)}
                      className="customization-theme-button"
                    >
                      {theme.name}
                    </button>
                    <button
                      onClick={() => handleDeleteCustomTheme(theme.id)}
                      className="customization-theme-delete"
                      title="Delete theme"
                    >
                      <Icons name="Trash2" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Advanced Mode Toggle */}
          <div className="customization-section">
            <label className="customization-checkbox">
              <input
                type="checkbox"
                checked={showAdvanced}
                onChange={(e) => setShowAdvanced(e.target.checked)}
              />
              <span>Show Advanced Tokens</span>
            </label>
          </div>
          
          {/* Token Controls by Category */}
          {Object.entries(tokensByCategory).map(([category, subcategories]) => {
            // Skip typography category - we have a custom control for it
            if (category === 'typography') {
              return (
                <div key={category} className="customization-category">
                  <h3 className="customization-category-title">
                    {tokenCategories[category as keyof typeof tokenCategories] || category}
                  </h3>
                  <TypographySystemControl />
                </div>
              );
            }
            
            return (
              <div key={category} className="customization-category">
                <h3 className="customization-category-title">
                  {tokenCategories[category as keyof typeof tokenCategories] || category}
                </h3>
                
                {Object.entries(subcategories).map(([subcategory, tokens]) => (
                  <div key={subcategory} className="customization-subcategory">
                    <h4 className="customization-subcategory-title">{subcategory}</h4>
                    <div className="customization-token-list">
                      {tokens.map(token => (
                        <TokenControl key={token.name} token={token} />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </div>
      
      {/* Save Dialog */}
      {showSaveDialog && (
        <div className="customization-dialog-overlay" onClick={() => setShowSaveDialog(false)}>
          <div className="customization-dialog" onClick={(e) => e.stopPropagation()}>
            <h3 className="customization-dialog-title">Save Custom Theme</h3>
            <input
              type="text"
              value={themeName}
              onChange={(e) => setThemeName(e.target.value)}
              placeholder="Enter theme name..."
              className="customization-dialog-input"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSave();
                if (e.key === 'Escape') setShowSaveDialog(false);
              }}
            />
            <div className="customization-dialog-actions">
              <button
                onClick={() => setShowSaveDialog(false)}
                className="customization-button secondary"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={!themeName.trim()}
                className="customization-button primary"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

