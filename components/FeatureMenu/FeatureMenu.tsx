import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useFeatureFlags } from '../../context/FeatureFlagContext';
import { useDesignSystem } from '../../context/DesignSystemContext';
import { useScenarios } from '../../context/ScenarioContext';
import Toggle from '../Toggle/Toggle';
import Collapsible from '../Collapsible/Collapsible';
import { Icons } from '../Icons/Icons';
import { loadThemeManifest, loadTheme, ThemeMetadata } from '../../themes/colors';
import { getCurrentThemeFilename } from '../../themes/colors/loadTheme';
import gsap from 'gsap';
import './FeatureMenu.css';

// Sans-serif fonts for testing (includes custom and Google Fonts)
const SANS_SERIF_FONTS = [
  'Soehne',
  'Inter',
  'Noto Sans',
  'Roboto',
  'Host Grotesk',
  'Open Sans',
  'Lato',
  'Montserrat',
  'Poppins',
  'Source Sans 3',
  'Raleway',
  'Work Sans',
  'Nunito'
];

const SERIF_FONTS = [
  'Playfair Display',
  'Merriweather',
  'Lora',
  'PT Serif',
  'Crimson Text',
  'Source Serif 4',
  'Libre Baskerville',
  'EB Garamond',
  'Cormorant',
  'Spectral'
];

const toKebabCase = (str: string) => str.replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, '$1-$2').toLowerCase();
const toSentenceCase = (str: string) => {
  const result = str.replace(/([A-Z])/g, ' $1');
  return result.charAt(0).toUpperCase() + result.slice(1);
};

const FeatureMenu: React.FC<{ onOpenCustomization?: () => void }> = ({ onOpenCustomization }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const cogRef = useRef<HTMLDivElement>(null);
  const { flags, setFlag } = useFeatureFlags();
  const { themeMode, toggleTheme, setThemeMode, designSystem, isNewDesign } = useDesignSystem();
  const { activeScenario, scenarioView, setScenarioView } = useScenarios();
  const location = useLocation();

  // Typography testing state
  const [sansSerifFont, setSansSerifFont] = useState<string>(() => {
    return localStorage.getItem('testFont-sansSerif') || 'Soehne';
  });
  const [serifFont, setSerifFont] = useState<string>(() => {
    return localStorage.getItem('testFont-serif') || 'Playfair Display';
  });
  
  // Theme selection state
  const [availableThemes, setAvailableThemes] = useState<ThemeMetadata[]>([]);
  const [themesLoading, setThemesLoading] = useState(true);
  const [selectedTheme, setSelectedTheme] = useState<string>(() => {
    const savedTheme = getCurrentThemeFilename();
    // Will be matched against themes once loaded
    return savedTheme ? '' : 'default';
  });
  
  // Load themes from manifest on mount
  useEffect(() => {
    const loadThemes = async () => {
      setThemesLoading(true);
      try {
        const themes = await loadThemeManifest();
        setAvailableThemes(themes);
        
        // Find current theme by filename
        const currentFilename = getCurrentThemeFilename();
        if (currentFilename) {
          const currentTheme = themes.find(t => t.filename === currentFilename);
          setSelectedTheme(currentTheme?.id || 'default');
        } else {
          setSelectedTheme('default');
        }
      } catch (error) {
        console.error('Failed to load theme manifest:', error);
        setAvailableThemes([{ id: 'default', name: 'Default', filename: '', isDefault: true }]);
        setSelectedTheme('default');
      } finally {
        setThemesLoading(false);
      }
    };
    loadThemes();
  }, []);
  
  // Handle theme change
  const handleThemeChange = async (themeId: string) => {
    const theme = availableThemes.find(t => t.id === themeId);
    if (!theme) return;
    
    setSelectedTheme(themeId);
    try {
      await loadTheme(theme);
      
      // Sync font dropdowns if theme has fonts
      if (theme.displayFont) {
        setSansSerifFont(theme.displayFont);
      }
      if (theme.bodyFont) {
        setSerifFont(theme.bodyFont);
      }
    } catch (error) {
      console.error('Failed to load theme:', error);
    }
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      console.log(event.key)
      // Support both Command+/ (Mac) and Alt+/ (Windows/Linux)
      if ((event.metaKey || event.altKey) && event.key === '/') {
        if (!isOpen) {
          setIsOpen(true);
        } else if (isMinimized) {
          setIsMinimized(false);
        } else {
          setIsOpen(false);
        }
      }
      if (event.key === 'Escape') {
        if (isMinimized) {
          setIsMinimized(false);
        } else {
          setIsOpen(false);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, isMinimized]);

  // Animate menu in/out
  useEffect(() => {
    if (!menuRef.current || !contentRef.current) return;

    if (isOpen && !isMinimized) {
      gsap.fromTo(
        menuRef.current,
        {
          scale: 0.9,
          opacity: 0,
          x: 20,
        },
        {
          scale: 1,
          opacity: 1,
          x: 0,
          duration: 0.2,
          delay: 0,

          ease: 'power3.out',
        }
      );
    }
  }, [isOpen, isMinimized]);

 

  const handleMinimize = () => {
    setIsMinimized(true);
  };

  const handleExpand = () => {
    setIsMinimized(false);
  };

  const handleClose = () => {
    if (menuRef.current) {
      gsap.to(menuRef.current, {
        scale: 0.8,
        opacity: 0,
        x: 20,
        duration: 0.3,
        ease: 'power3.in',
        onComplete: () => {
          setIsOpen(false);
          setIsMinimized(false);
        },
      });
    }
  };

  // Feature flag classes are now applied to HTML element by DesignSystemContext
  // This ensures the coupling pattern .new-branding.new-feature works correctly

  // Load Google Fonts dynamically and apply to CSS variables
  useEffect(() => {
    // Remove existing test font link if it exists
    const existingLink = document.getElementById('test-fonts-link');
    if (existingLink) {
      existingLink.remove();
    }

    // Create new link element for Google Fonts
    const link = document.createElement('link');
    link.id = 'test-fonts-link';
    link.rel = 'stylesheet';
    link.href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(sansSerifFont)}:wght@400;500;600;700&family=${encodeURIComponent(serifFont)}:wght@400;500;600;700&display=swap`;
    document.head.appendChild(link);

    // Apply fonts to CSS custom properties
    document.documentElement.style.setProperty('--font-family-default', `'${sansSerifFont}', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`);
    document.documentElement.style.setProperty('--font-family-serif', `'${serifFont}', Georgia, 'Times New Roman', serif`);

    // Persist to localStorage
    localStorage.setItem('testFont-sansSerif', sansSerifFont);
    localStorage.setItem('testFont-serif', serifFont);
  }, [sansSerifFont, serifFont]);

  if (!isOpen) {
    return null;
  }

  return (
    <div className="feature-menu" ref={menuRef}>
      {/* Cog icon for minimized state */}
      {/* <div 
        className="feature-menu-cog" 
        ref={cogRef}
        onClick={handleExpand}
        style={{ opacity: 0, pointerEvents: isMinimized ? 'auto' : 'none' }}
      >
        <Icons name="Settings" />
      </div> */}

      {/* Menu content */}
      <div className="feature-menu-content" ref={contentRef}>
        {/* Header with buttons */}
        <div className="feature-menu-header">
          {/* <button
            className="feature-menu-button feature-menu-minimize"
            onClick={handleMinimize}
            aria-label="Minimize"
          >
            <Icons name="Minimize2" />
          </button> */}
          <button
            className="feature-menu-button feature-menu-close"
            onClick={handleClose}
            aria-label="Close"
          >
            <Icons name="X" />
          </button>
        </div>


        {/* <a href="/design-system"
          className="feature-menu-link"
          onClick={() => setIsOpen(false)}
        >
          <span>Design System Demo</span>
        </a> */}

        <div className="feature-menu-section">
          <div className="design-system-info">
            <p className="info-text">
              <strong>Current Design:</strong> {isNewDesign ? 'NEW (Live Toqan)' : 'OLD (Mockup)'}
            </p>
            <p className="info-text">
              <strong>Theme Mode:</strong> {themeMode}
            </p>
            <div className="design-system-links">
              {/* <div className="design-system-link-with-icon">
                <span className="design-system-label">Design System</span>
              </div> */}
              <div className="design-system-actions">
                {/* <button
                  className="design-system-action-btn"
                  onClick={() => {
                    onOpenCustomization?.();
                    setIsOpen(false);
                  }}
                  title="Edit design tokens (Alt+\)"
                >
                  Edit
                </button> */}
                <Link
                  to="/theme-builder"
                  className="design-system-action-btn"
                  onClick={() => setIsOpen(false)}
                >
                  Theme Builder
                </Link>
                <Link
                  to="/design-system"
                  className="design-system-action-btn"
                  onClick={() => setIsOpen(false)}
                >
                  System tokens
                </Link>
              </div>
            </div>
          </div>
          
          {/* Theme Selector */}
          <div className="theme-selector">
            <label htmlFor="theme-select" className="theme-selector-label">
              <Icons name="Palette" />
              <span>Theme</span>
            </label>
            <select
              id="theme-select"
              value={selectedTheme}
              onChange={(e) => handleThemeChange(e.target.value)}
              className="theme-dropdown"
              disabled={themesLoading}
            >
              {themesLoading ? (
                <option>Loading...</option>
              ) : (
                availableThemes.map(theme => (
                  <option key={theme.id} value={theme.id}>
                    {theme.name}
                  </option>
                ))
              )}
            </select>
            <Link
              to="/theme-builder"
              className="theme-builder-link"
              onClick={() => setIsOpen(false)}
              title="Open Theme Builder"
            >
              <Icons name="Plus" />
            </Link>
          </div>
          
          <Toggle
            variant="button"
            leftOption="Light"
            rightOption="Dark"
            checked={themeMode === 'dark'}
            onChange={(checked) => setThemeMode(checked ? 'dark' : 'light')}
          />
        </div>

        <hr />

        <div className="feature-menu-section">
          <h3>Feature Flags</h3>
          
          <Collapsible closeOnOutsideClick={false} storageKey="new-branding">
            <Collapsible.Trigger className="feature-menu-collapsible-trigger">
              <span>New branding</span>
              <Icons name="ChevronDown" className="chevron-icon" />
            </Collapsible.Trigger>
            <Collapsible.Content>
              <div className="feature-menu-collapsible-content">
                <Toggle
                  className="group-master-toggle"
                  label="Enable new features"
                  checked={flags.newBranding}
                  onChange={(checked) => setFlag('newBranding', checked)}
                />
                {/* <hr style={{ margin: 'var(--space-3) 0', border: 'none', borderTop: '1px solid var(--color-ui-border)' }} /> */}
                <Toggle
                  label="Color mode"
                  checked={flags.themes}
                  onChange={(checked) => setFlag('themes', checked)}
                />
                <Toggle
                  label="Theme selector"
                  checked={flags.themeSelector}
                  onChange={(checked) => setFlag('themeSelector', checked)}
                />
                <Toggle
                  label="Typography"
                  checked={flags.newTypography}
                  onChange={(checked) => setFlag('newTypography', checked)}
                />
                <Toggle
                  label="Chat Bubbles"
                  checked={flags.newBubble}
                  onChange={(checked) => setFlag('newBubble', checked)}
                />
                <Toggle
                  label="Tables"
                  checked={flags.newTables}
                  onChange={(checked) => setFlag('newTables', checked)}
                />
                <Toggle
                  label="Top bar"
                  checked={flags.newTopNavbar}
                  onChange={(checked) => setFlag('newTopNavbar', checked)}
                />
                <Toggle
                  label="Left Sidebar"
                  checked={flags.newLeftSidebar}
                  onChange={(checked) => setFlag('newLeftSidebar', checked)}
                />
                <Toggle
                  label="Right Panel"
                  checked={flags.newRightPanel}
                  onChange={(checked) => setFlag('newRightPanel', checked)}
                />
                <Toggle
                  label="Main Stage"
                  checked={flags.newMainStage}
                  onChange={(checked) => setFlag('newMainStage', checked)}
                />
                <Toggle
                  label="Gradient Background"
                  checked={flags.newGradientBackground}
                  onChange={(checked) => setFlag('newGradientBackground', checked)}
                />
                <Toggle
                  label="Resizable Panels"
                  checked={flags.newResizeablePanels}
                  onChange={(checked) => setFlag('newResizeablePanels', checked)}
                />
                <Toggle
                  label="Workspaces"
                  checked={flags.workspaces}
                  onChange={(checked) => setFlag('workspaces', checked)}
                />
              </div>
            </Collapsible.Content>
          </Collapsible>

          <Collapsible closeOnOutsideClick={false} storageKey="conversations">
            <Collapsible.Trigger className="feature-menu-collapsible-trigger">
              <span>Conversations</span>
              <Icons name="ChevronDown" className="chevron-icon" />
            </Collapsible.Trigger>
            <Collapsible.Content>
              <div className="feature-menu-collapsible-content">
                <Toggle
                  label="Pin"
                  checked={flags.conversationPin}
                  onChange={(checked) => setFlag('conversationPin', checked)}
                />
                <Toggle
                  label="Rename"
                  checked={flags.conversationRename}
                  onChange={(checked) => setFlag('conversationRename', checked)}
                />
                <Toggle
                  label="Wrap"
                  checked={flags.conversationWrap}
                  onChange={(checked) => setFlag('conversationWrap', checked)}
                />
                <Toggle
                  label="Collapsible"
                  checked={flags.conversationCollapsible}
                  onChange={(checked) => setFlag('conversationCollapsible', checked)}
                />
                <Toggle
                  label="Timestamps"
                  checked={flags.conversationTimestamps}
                  onChange={(checked) => setFlag('conversationTimestamps', checked)}
                />
                <Toggle
                  label="Menu"
                  checked={flags.conversationMenu}
                  onChange={(checked) => setFlag('conversationMenu', checked)}
                />
              </div>
            </Collapsible.Content>
          </Collapsible>

          <Collapsible closeOnOutsideClick={false} storageKey="discovery">
            <Collapsible.Trigger className="feature-menu-collapsible-trigger">
              <span>Discovery</span>
              <Icons name="ChevronDown" className="chevron-icon" />
            </Collapsible.Trigger>
            <Collapsible.Content>
              <div className="feature-menu-collapsible-content">
                <Toggle
                  label="Plays"
                  checked={flags.plays}
                  onChange={(checked) => setFlag('plays', checked)}
                />
                <Toggle
                  label="Built By Others"
                  checked={flags.builtByOther}
                  onChange={(checked) => setFlag('builtByOther', checked)}
                />
              </div>
            </Collapsible.Content>
          </Collapsible>

          {/* <Collapsible closeOnOutsideClick={false} storageKey="personalization">
            <Collapsible.Trigger className="feature-menu-collapsible-trigger">
              <span>Personalization</span>
              <Icons name="ChevronDown" className="chevron-icon" />
            </Collapsible.Trigger>
            <Collapsible.Content>
              <div className="feature-menu-collapsible-content">
                <Toggle
                  label="Color mode"
                  checked={flags.themes}
                  onChange={(checked) => setFlag('themes', checked)}
                />
                <Toggle
                  label="Show Theme Debugger"
                  checked={flags.showThemeDebugger}
                  onChange={(checked) => setFlag('showThemeDebugger', checked)}
                />
              </div>
            </Collapsible.Content>
          </Collapsible> */}

          {/* <Collapsible closeOnOutsideClick={false} storageKey="typography">
            <Collapsible.Trigger className="feature-menu-collapsible-trigger">
              <span>Typography</span>
              <Icons name="ChevronDown" className="chevron-icon" />
            </Collapsible.Trigger>
            <Collapsible.Content>
              <div className="feature-menu-collapsible-content">
                <div className="typography-controls">
                  <div className="font-selector">
                    <label htmlFor="sans-serif-font">Sans-serif</label>
                    <select
                      id="sans-serif-font"
                      value={sansSerifFont}
                      onChange={(e) => setSansSerifFont(e.target.value)}
                      className="font-dropdown"
                    >
                      {SANS_SERIF_FONTS.map(font => (
                        <option key={font} value={font}>{font}</option>
                      ))}
                    </select>
                  </div>
                  <div className="font-selector">
                    <label htmlFor="serif-font">Serif</label>
                    <select
                      id="serif-font"
                      value={serifFont}
                      onChange={(e) => setSerifFont(e.target.value)}
                      className="font-dropdown"
                    >
                      {SERIF_FONTS.map(font => (
                        <option key={font} value={font}>{font}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </Collapsible.Content>
          </Collapsible> */}

          {Object.keys(flags).filter(flag => 
            !['newBranding', 'newTypography', 'newBubble', 'newTables', 'newTopNavbar', 'newLeftSidebar', 'newRightPanel', 'newMainStage', 'newResizeablePanels', 'workspaces', 'conversationPin', 'conversationRename', 'conversationWrap', 'conversationCollapsible', 'conversationTimestamps', 'conversationMenu', 'plays', 'builtByOther', 'themes', 'themeSelector', 'showThemeDebugger'].includes(flag)
          ).map(flag => (
            <Toggle
              key={flag}
              label={toSentenceCase(flag)}
              checked={flags[flag as keyof typeof flags]}
              onChange={(checked) => {
                setFlag(flag as keyof typeof flags, checked);
              }}
            />
          ))}
        </div>

        {activeScenario && (
          <>
            <hr />

            <div className="feature-menu-section">
              <h3>scenario: {activeScenario.title}</h3>
              <Toggle
                variant="button"
                leftOption="Before"
                rightOption="After"
                checked={scenarioView === 'after'}
                onChange={(checked) => {
                  setScenarioView(checked ? 'after' : 'before');
                }}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default FeatureMenu;