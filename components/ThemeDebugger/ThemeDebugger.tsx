import React, { useEffect, useState } from 'react';
import { useDesignSystem } from '../../context/DesignSystemContext';

/**
 * Debug component to show what classes are on body
 * and what tokens are being computed
 */
const ThemeDebugger: React.FC = () => {
  const { designSystem, themeMode, isDark, isNewDesign } = useDesignSystem();
  const [bodyClasses, setBodyClasses] = useState<string>('');
  const [computedTokens, setComputedTokens] = useState<Record<string, string>>({});

  useEffect(() => {
    // Get html (root) and body classes
    const htmlClasses = document.documentElement.className;
    const bodyClasses = document.body.className;
    setBodyClasses(`HTML: ${htmlClasses}\nBODY: ${bodyClasses}`);

    // Get computed style tokens from :root (html element)
    const root = document.documentElement;
    const computed = window.getComputedStyle(root);
    
    setComputedTokens({
      '--color-ui-background': computed.getPropertyValue('--color-ui-background'),
      '--color-text-default': computed.getPropertyValue('--color-text-default'),
      '--color-ui-border': computed.getPropertyValue('--color-ui-border'),
      '--color-primary-default': computed.getPropertyValue('--color-primary-default'),
      '--theme-bg-app': computed.getPropertyValue('--theme-bg-app'),
      '--theme-text-main': computed.getPropertyValue('--theme-text-main'),
    });
  }, [themeMode, designSystem]);

  return (
    <div style={{
      position: 'fixed',
      bottom: 20,
      left: 20,
      background: 'rgba(0,0,0,0.9)',
      color: '#fff',
      padding: '20px',
      borderRadius: '8px',
      fontSize: '12px',
      fontFamily: 'monospace',
      zIndex: 10000,
      maxWidth: '400px',
      maxHeight: '80vh',
      overflow: 'auto',
    }}>
      <h3 style={{ margin: '0 0 10px 0', color: '#0f0' }}>Theme Debugger</h3>
      
      <div style={{ marginBottom: '10px' }}>
        <strong>Context State:</strong><br/>
        Design: {designSystem} | Theme: {themeMode}<br/>
        isDark: {isDark.toString()} | isNewDesign: {isNewDesign.toString()}
      </div>

      <div style={{ marginBottom: '10px' }}>
        <strong>Body Classes:</strong><br/>
        <code style={{ color: '#ff0' }}>{bodyClasses || 'none'}</code>
      </div>

      <div>
        <strong>Computed Tokens:</strong><br/>
        {Object.entries(computedTokens).map(([key, value]) => (
          <div key={key} style={{ marginLeft: '10px' }}>
            <span style={{ color: '#0ff' }}>{key}:</span>{' '}
            <span style={{ color: value.includes('#') || value.includes('rgb') ? '#0f0' : '#f00' }}>
              {value || 'UNDEFINED'}
            </span>
          </div>
        ))}
      </div>

      <div style={{ marginTop: '10px', fontSize: '10px', opacity: 0.7 }}>
        Expected for dark mode:<br/>
        - .theme-dark class on body<br/>
        - --color-ui-background should be dark (#0A0A0B)<br/>
        - --color-text-default should be light (#F5F5F7)
      </div>
    </div>
  );
};

export default ThemeDebugger;

