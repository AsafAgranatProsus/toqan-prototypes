import React from 'react';
import { useDesignSystem } from '../../context/DesignSystemContext';
import { useFeatureFlags } from '../../context/FeatureFlagContext';
import Button from '../Button/Button';
import './DesignSystemDemo.css';

interface ColorSwatchProps {
  name: string;
  hex: string;
  description: string;
  token?: string;
}

const ColorSwatch: React.FC<ColorSwatchProps> = ({ name, hex, description, token }) => {
  const style = token 
    ? { backgroundColor: `var(${token})` }
    : { backgroundColor: hex };
    
  return (
    <div className="color-swatch">
      <div className="color-swatch-box" style={style} />
      <div className="color-swatch-info">
        <div className="color-swatch-name">{name}</div>
        <div className="color-swatch-hex">{hex}</div>
        <div className="color-swatch-description">{description}</div>
      </div>
    </div>
  );
};

/**
 * DesignSystemDemo
 * 
 * A visual demonstration of design tokens organized by category
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
        <h1>Design System Tokens</h1>
        <div className="demo-meta">
          <span className="demo-badge">{isNewDesign ? 'NEW Design' : 'OLD Design'}</span>
          <span className="demo-badge">{themeMode} mode</span>
        </div>
      </div>

      <div className="demo-controls">
        <Button variant="secondary" onClick={handleToggleDesign}>
          Switch to {isNewDesign ? 'OLD' : 'NEW'} Design
        </Button>
        <Button variant="secondary" onClick={toggleTheme}>
          Toggle {isDark ? 'Light' : 'Dark'} Mode
        </Button>
      </div>

      <div className="demo-content">
        {/* Brand Colours */}
        <section className="color-section">
          <h2>Brand colours</h2>
          <div className="color-grid">
            <ColorSwatch 
              name="Primary"
              hex="--color-primary-default"
              description="Primary brand color"
              token="--color-primary-default"
            />
            <ColorSwatch 
              name="Primary Hover"
              hex="--color-primary-hover"
              description="Hover state for primary"
              token="--color-primary-hover"
            />
            <ColorSwatch 
              name="Primary Light"
              hex="--color-primary-light"
              description="Light variant for backgrounds"
              token="--color-primary-light"
            />
          </div>
        </section>

        {/* Action Colours */}
        <section className="color-section">
          <h2>Action colours</h2>
          <div className="color-grid">
            <ColorSwatch 
              name="Info"
              hex="--color-info-default"
              description="Used for link text and other actionable elements"
              token="--color-info-default"
            />
            <ColorSwatch 
              name="Success"
              hex="--color-success-default"
              description="Used for primary buttons relating to success states"
              token="--color-success-default"
            />
          </div>
        </section>

        {/* UI Colors */}
        <section className="color-section">
          <h2>UI colours</h2>
          <div className="color-grid">
            <ColorSwatch 
              name="Background"
              hex="--color-ui-background"
              description="Primary background colour"
              token="--color-ui-background"
            />
            <ColorSwatch 
              name="Background Elevated"
              hex="--color-ui-background-elevated"
              description="Secondary background colour"
              token="--color-ui-background-elevated"
            />
            <ColorSwatch 
              name="Border"
              hex="--color-ui-border"
              description="Used for borders"
              token="--color-ui-border"
            />
            <ColorSwatch 
              name="Active"
              hex="--color-ui-active"
              description="Active/hover state background"
              token="--color-ui-active"
            />
          </div>
        </section>

        {/* Text Colors */}
        <section className="color-section">
          <h2>Text colours</h2>
          <div className="color-grid">
            <ColorSwatch 
              name="Text Default"
              hex="--color-text-default"
              description="Used for heading text"
              token="--color-text-default"
            />
            <ColorSwatch 
              name="Text Secondary"
              hex="--color-text-secondary"
              description="Used for secondary text"
              token="--color-text-secondary"
            />
            <ColorSwatch 
              name="Text Tertiary"
              hex="--color-text-tertiary"
              description="Used for tertiary/muted text"
              token="--color-text-tertiary"
            />
          </div>
        </section>

        {/* Notifications */}
        <section className="color-section">
          <h2>Notifications</h2>
          <div className="color-grid">
            <ColorSwatch 
              name="Warning"
              hex="--color-warning-default"
              description="Warning state"
              token="--color-warning-default"
            />
            <ColorSwatch 
              name="Error"
              hex="--color-error-default"
              description="Error state"
              token="--color-error-default"
            />
            <ColorSwatch 
              name="Success"
              hex="--color-success-default"
              description="Success state"
              token="--color-success-default"
            />
          </div>
        </section>

        {/* Spacing */}
        <section className="demo-section">
          <h2>Spacing scale</h2>
          <div className="spacing-demo">
            {[1, 2, 3, 4, 6, 8, 10, 12, 16].map(num => (
              <div key={num} className="spacing-item">
                <div 
                  className="spacing-bar" 
                  style={{ 
                    width: `var(--space-${num})`,
                    backgroundColor: 'var(--color-primary-default)'
                  }}
                />
                <code className="spacing-label">space-{num}</code>
              </div>
            ))}
          </div>
        </section>

        {/* Border Radius */}
        <section className="demo-section">
          <h2>Border radius</h2>
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
                <code>radius-{size}</code>
              </div>
            ))}
          </div>
        </section>

        {/* Typography */}
        <section className="demo-section">
          <h2>Typography</h2>
          <div className="typography-demo">
            <div className="typography-item">
              <h1 style={{ fontSize: 'var(--font-size-heading-xl)' }}>Heading XL</h1>
              <code>--font-size-heading-xl</code>
            </div>
            <div className="typography-item">
              <h2 style={{ fontSize: 'var(--font-size-heading-lg)' }}>Heading LG</h2>
              <code>--font-size-heading-lg</code>
            </div>
            <div className="typography-item">
              <h3 style={{ fontSize: 'var(--font-size-heading-md)' }}>Heading MD</h3>
              <code>--font-size-heading-md</code>
            </div>
            <div className="typography-item">
              <h4 style={{ fontSize: 'var(--font-size-heading-sm)' }}>Heading SM</h4>
              <code>--font-size-heading-sm</code>
            </div>
            <div className="typography-item">
              <p style={{ fontSize: 'var(--font-size-body-md)' }}>Body MD (default)</p>
              <code>--font-size-body-md</code>
            </div>
            <div className="typography-item">
              <p style={{ fontSize: 'var(--font-size-body-sm)' }}>Body SM</p>
              <code>--font-size-body-sm</code>
            </div>
            <div className="typography-item">
              <p style={{ fontSize: 'var(--font-size-body-xs)' }}>Body XS</p>
              <code>--font-size-body-xs</code>
            </div>
          </div>
        </section>

        {/* Shadows */}
        <section className="demo-section">
          <h2>Shadows</h2>
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
                <code>shadow-{size}</code>
              </div>
            ))}
          </div>
        </section>

        {/* Components */}
        <section className="demo-section">
          <h2>Button components</h2>
          <div className="button-demo">
            <Button variant="primary">Primary Button</Button>
            <Button variant="secondary">Secondary Button</Button>
            <Button variant="tertiary">Tertiary Button</Button>
            <Button variant="primary" icon="Plus">With Icon</Button>
            <Button variant="secondary" icon="ArrowRight" iconPosition="right">
              Icon Right
            </Button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default DesignSystemDemo;