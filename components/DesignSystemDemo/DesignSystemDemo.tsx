import React from 'react';
import { useDesignSystem } from '../../context/DesignSystemContext';
import { useFeatureFlags } from '../../context/FeatureFlagContext';
import Button from '../Button/Button';
import './DesignSystemDemo.css';

/**
 * DesignSystemDemo
 * 
 * A visual demonstration component that shows:
 * 1. Current design system (old vs new)
 * 2. Current theme mode (light vs dark)
 * 3. All design tokens in action
 * 4. Controls to switch between states
 */
const DesignSystemDemo: React.FC = () => {
  const { designSystem, themeMode, toggleTheme, isDark, isNewDesign } = useDesignSystem();
  const { flags, setFlag } = useFeatureFlags();

  const handleToggleDesign = () => {
    setFlag('newBranding', !flags.newBranding);
  };

  return (
    <div className="design-system-demo">
      <div className="demo-header">
        <h1>Design System: {isNewDesign ? 'NEW (Live Toqan)' : 'OLD (Mockup)'}</h1>
        <p className="demo-subtitle">Theme Mode: {themeMode}</p>
      </div>

      <div className="demo-controls">
        <Button variant="primary" onClick={handleToggleDesign}>
          Switch to {isNewDesign ? 'OLD' : 'NEW'} Design
        </Button>
        <Button variant="secondary" onClick={toggleTheme}>
          Toggle {isDark ? 'Light' : 'Dark'} Mode
        </Button>
      </div>

      <div className="demo-sections">
        {/* Colors Section */}
        <section className="demo-section">
          <h2>Color Tokens</h2>
          <div className="token-grid">
            <div className="token-card" style={{ backgroundColor: 'var(--color-primary-default)' }}>
              <span className="token-label">Primary</span>
              <code>--color-primary-default</code>
            </div>
            <div className="token-card" style={{ backgroundColor: 'var(--color-ui-background)' }}>
              <span className="token-label">Background</span>
              <code>--color-ui-background</code>
            </div>
            <div className="token-card" style={{ backgroundColor: 'var(--color-ui-border)', border: '1px solid var(--color-text-default)' }}>
              <span className="token-label">Border</span>
              <code>--color-ui-border</code>
            </div>
            <div className="token-card" style={{ backgroundColor: 'var(--color-error-default)' }}>
              <span className="token-label">Error</span>
              <code>--color-error-default</code>
            </div>
            <div className="token-card" style={{ backgroundColor: 'var(--color-warning-default)' }}>
              <span className="token-label">Warning</span>
              <code>--color-warning-default</code>
            </div>
            <div className="token-card" style={{ backgroundColor: 'var(--color-success-default)' }}>
              <span className="token-label">Success</span>
              <code>--color-success-default</code>
            </div>
          </div>
        </section>

        {/* Spacing Section */}
        <section className="demo-section">
          <h2>Spacing Tokens</h2>
          <div className="spacing-demo">
            {[1, 2, 3, 4, 6, 8].map(num => (
              <div key={num} className="spacing-item">
                <div 
                  className="spacing-box" 
                  style={{ 
                    width: `var(--space-${num})`,
                    height: `var(--space-${num})`,
                    backgroundColor: 'var(--color-primary-default)'
                  }}
                />
                <code>--space-{num}</code>
              </div>
            ))}
          </div>
        </section>

        {/* Border Radius Section */}
        <section className="demo-section">
          <h2>Border Radius Tokens</h2>
          <div className="radius-demo">
            {['sm', 'default', 'md', 'lg', 'xl', 'full'].map(size => (
              <div key={size} className="radius-item">
                <div 
                  className="radius-box" 
                  style={{ 
                    borderRadius: `var(--radius-${size})`,
                    backgroundColor: 'var(--color-primary-default)'
                  }}
                />
                <code>--radius-{size}</code>
              </div>
            ))}
          </div>
        </section>

        {/* Typography Section */}
        <section className="demo-section">
          <h2>Typography Tokens</h2>
          <div className="typography-demo">
            <p style={{ fontSize: 'var(--font-size-body-xs)' }}>
              Body XS (--font-size-body-xs)
            </p>
            <p style={{ fontSize: 'var(--font-size-body-sm)' }}>
              Body SM (--font-size-body-sm)
            </p>
            <p style={{ fontSize: 'var(--font-size-body-md)' }}>
              Body MD (--font-size-body-md)
            </p>
            <h4 style={{ fontSize: 'var(--font-size-heading-xs)' }}>
              Heading XS (--font-size-heading-xs)
            </h4>
            <h3 style={{ fontSize: 'var(--font-size-heading-sm)' }}>
              Heading SM (--font-size-heading-sm)
            </h3>
            <h2 style={{ fontSize: 'var(--font-size-heading-md)' }}>
              Heading MD (--font-size-heading-md)
            </h2>
          </div>
        </section>

        {/* Shadows Section */}
        <section className="demo-section">
          <h2>Shadow Tokens</h2>
          <div className="shadow-demo">
            {['sm', 'default', 'md', 'lg', 'modal'].map(size => (
              <div 
                key={size} 
                className="shadow-box"
                style={{ 
                  boxShadow: `var(--shadow-${size})`,
                  backgroundColor: 'var(--color-ui-background-elevated)'
                }}
              >
                <code>--shadow-{size}</code>
              </div>
            ))}
          </div>
        </section>

        {/* Button Variants */}
        <section className="demo-section">
          <h2>Button Components</h2>
          <div className="button-demo">
            <Button variant="primary">Primary Button</Button>
            <Button variant="secondary">Secondary Button</Button>
            <Button variant="tertiary">Tertiary Button</Button>
            <Button variant="primary" icon="plus">With Icon</Button>
            <Button variant="primary" icon="check" iconPosition="right">
              Icon Right
            </Button>
          </div>
        </section>
      </div>

      <div className="demo-footer">
        <p>
          <strong>Testing:</strong> Ensure this looks good in all 4 combinations:
        </p>
        <ul>
          <li>OLD Design + Light Mode {!isNewDesign && !isDark && '✓ (Current)'}</li>
          <li>OLD Design + Dark Mode {!isNewDesign && isDark && '✓ (Current)'}</li>
          <li>NEW Design + Light Mode {isNewDesign && !isDark && '✓ (Current)'}</li>
          <li>NEW Design + Dark Mode {isNewDesign && isDark && '✓ (Current)'}</li>
        </ul>
      </div>
    </div>
  );
};

export default DesignSystemDemo;

