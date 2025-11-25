import React, { useState } from 'react';
import { useDesignSystem } from '../../context/DesignSystemContext';
import { useFeatureFlags } from '../../context/FeatureFlagContext';
import Button from '../Button/Button';
import { Icons } from '../Icons/Icons';
import './DesignSystemDemo.css';

interface ColorSwatchProps {
  name: string;
  hex: string;
  description: string;
  token?: string;
}

const ColorSwatch: React.FC<ColorSwatchProps> = ({ name, hex, description, token }) => {
  const [copied, setCopied] = useState(false);
  const style = token 
    ? { backgroundColor: `var(${token})` }
    : { backgroundColor: hex };
  
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(hex);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };
    
  return (
    <div className="color-swatch">
      <div className="color-swatch-box" style={style} />
      <div className="color-swatch-info">
        <div className="color-swatch-name">{name}</div>
        <div className="color-swatch-description">{description}</div>
        <div className="color-swatch-hex">
          <code className="token-name">{hex}</code>
        </div>
      </div>
      <button 
        className="color-swatch-copy"
        onClick={handleCopy}
        aria-label={`Copy ${name} token`}
        title={copied ? 'Copied!' : 'Copy token'}
      >
        {copied ? <Icons name="Check" /> : <Icons name="Copy" />}
      </button>
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
        <h1>Toqan Lean Design System</h1>
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
        <section className="demo-section-split">
          <h2>Brand colours</h2>
          <div className="split-layout">
            <div className="split-tokens">
              <h3 className="split-subtitle">Tokens</h3>
              <div className="color-list">
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
            </div>
            <div className="split-examples">
              <h3 className="split-subtitle">Examples</h3>
              <div className="examples-container">
                <Button variant="primary">Primary Button</Button>
                <Button variant="primary" icon="Plus">With Icon</Button>
                <div className="example-card">
                  <div className="example-badge" style={{ 
                    backgroundColor: 'var(--color-primary-default)',
                    color: 'var(--color-text-light)'
                  }}>
                    Featured
                  </div>
                  <a href="#" style={{ color: 'var(--color-primary-default)' }}>Primary link text</a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Action Colours */}
        <section className="demo-section-split">
          <h2>Action colours</h2>
          <div className="split-layout">
            <div className="split-tokens">
              <h3 className="split-subtitle">Tokens</h3>
              <div className="color-list">
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
            </div>
            <div className="split-examples">
              <h3 className="split-subtitle">Examples</h3>
              <div className="examples-container">
                <div className="example-alert" style={{
                  backgroundColor: 'var(--color-info-background)',
                  color: 'var(--color-info-default)',
                  padding: 'var(--space-4)',
                  borderRadius: 'var(--radius-default)',
                  border: '1px solid var(--color-info-default)'
                }}>
                  ℹ️ Information alert message
                </div>
                <div className="example-alert" style={{
                  backgroundColor: 'var(--color-success-background)',
                  color: 'var(--color-success-default)',
                  padding: 'var(--space-4)',
                  borderRadius: 'var(--radius-default)',
                  border: '1px solid var(--color-success-default)'
                }}>
                  ✓ Success! Action completed
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* UI Colors */}
        <section className="demo-section-split">
          <h2>UI colours</h2>
          <div className="split-layout">
            <div className="split-tokens">
              <h3 className="split-subtitle">Tokens</h3>
              <div className="color-list">
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
            </div>
            <div className="split-examples">
              <h3 className="split-subtitle">Examples</h3>
              <div className="examples-container">
                <div className="example-card" style={{
                  backgroundColor: 'var(--color-ui-background-elevated)',
                  border: '1px solid var(--color-ui-border)',
                  borderRadius: 'var(--radius-default)',
                  padding: 'var(--space-6)'
                }}>
                  <h4 style={{ margin: '0 0 var(--space-2) 0', color: 'var(--color-text-default)' }}>Card Component</h4>
                  <p style={{ margin: 0, color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-body-sm)' }}>
                    Uses elevated background with border
                  </p>
                </div>
                <div className="example-list-item" style={{
                  backgroundColor: 'var(--color-ui-active)',
                  padding: 'var(--space-3)',
                  borderRadius: 'var(--radius-sm)',
                  color: 'var(--color-text-default)'
                }}>
                  Active state background
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Text Colors */}
        <section className="demo-section-split">
          <h2>Text colours</h2>
          <div className="split-layout">
            <div className="split-tokens">
              <h3 className="split-subtitle">Tokens</h3>
              <div className="color-list">
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
            </div>
            <div className="split-examples">
              <h3 className="split-subtitle">Examples</h3>
              <div className="examples-container">
                <div className="example-text-hierarchy">
                  <h3 style={{ margin: '0 0 var(--space-2) 0', color: 'var(--color-text-default)' }}>
                    Heading uses default
                  </h3>
                  <p style={{ margin: '0 0 var(--space-2) 0', color: 'var(--color-text-secondary)' }}>
                    Body text uses secondary color for better hierarchy
                  </p>
                  <p style={{ margin: 0, fontSize: 'var(--font-size-body-sm)', color: 'var(--color-text-tertiary)' }}>
                    Captions and metadata use tertiary
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Notifications */}
        <section className="demo-section-split">
          <h2>Notifications</h2>
          <div className="split-layout">
            <div className="split-tokens">
              <h3 className="split-subtitle">Tokens</h3>
              <div className="color-list">
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
            </div>
            <div className="split-examples">
              <h3 className="split-subtitle">Examples</h3>
              <div className="examples-container">
                <div className="example-notification" style={{
                  backgroundColor: 'var(--color-warning-background)',
                  color: 'var(--color-warning-default)',
                  padding: 'var(--space-4)',
                  borderRadius: 'var(--radius-default)',
                  border: '1px solid var(--color-warning-default)',
                  fontWeight: 500
                }}>
                  ⚠️ Warning: Please review this action
                </div>
                <div className="example-notification" style={{
                  backgroundColor: 'var(--color-error-background)',
                  color: 'var(--color-error-default)',
                  padding: 'var(--space-4)',
                  borderRadius: 'var(--radius-default)',
                  border: '1px solid var(--color-error-default)',
                  fontWeight: 500
                }}>
                  ✕ Error: Something went wrong
                </div>
                <div className="example-notification" style={{
                  backgroundColor: 'var(--color-success-background)',
                  color: 'var(--color-success-default)',
                  padding: 'var(--space-4)',
                  borderRadius: 'var(--radius-default)',
                  border: '1px solid var(--color-success-default)',
                  fontWeight: 500
                }}>
                  ✓ Success: Changes saved
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Spacing */}
        <section className="demo-section-split">
          <h2>Spacing scale</h2>
          <div className="split-layout">
            <div className="split-tokens">
              <h3 className="split-subtitle">Tokens</h3>
              <div className="spacing-demo">
                {[1, 2, 3, 4, 6, 8, 10, 12, 16, 20, 24, 32, 40, 48].map(num => (
                  <div key={num} className="spacing-item">
                    <div 
                      className="spacing-bar" 
                      style={{ 
                        width: `var(--space-${num})`,
                        height: `var(--space-${num})`,
                        backgroundColor: 'var(--color-primary-default)'
                      }}
                    />
                    <code className="token-name spacing-label">--space-{num}</code>
                  </div>
                ))}
              </div>
            </div>
            <div className="split-examples">
              <h3 className="split-subtitle">Examples</h3>
              <div className="examples-container">
                <div className="example-spacing-card" style={{
                  backgroundColor: 'var(--color-ui-background-elevated)',
                  border: '1px solid var(--color-ui-border)',
                  borderRadius: 'var(--radius-default)',
                  padding: 'var(--space-6)'
                }}>
                  <h4 style={{ margin: '0 0 var(--space-4) 0' }}>Card with <code className="token-name">--space-6</code> padding</h4>
                  <p style={{ margin: '0 0 var(--space-3) 0' }}>Paragraph with <code className="token-name">--space-3</code> margin-bottom</p>
                  <Button variant="secondary">Button</Button>
                </div>
                <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
                  <div className="example-box">gap: <code className="token-name">--space-3</code></div>
                  <div className="example-box">between items</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Border Radius */}
        <section className="demo-section-split">
          <h2>Border radius</h2>
          <div className="split-layout">
            <div className="split-tokens">
              <h3 className="split-subtitle">Tokens</h3>
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
                    <code className="token-name">--radius-{size}</code>
                  </div>
                ))}
              </div>
            </div>
            <div className="split-examples">
              <h3 className="split-subtitle">Examples</h3>
              <div className="examples-container">
                <Button variant="primary" style={{ borderRadius: 'var(--radius-sm)' }}>
                  <code className="token-name">--radius-sm</code> Button
                </Button>
                <Button variant="secondary" style={{ borderRadius: 'var(--radius-default)' }}>
                  <code className="token-name">--radius-default</code> Button
                </Button>
                <div style={{
                  backgroundColor: 'var(--color-ui-background-elevated)',
                  border: '1px solid var(--color-ui-border)',
                  borderRadius: 'var(--radius-lg)',
                  padding: 'var(--space-4)'
                }}>
                  Card with <code className="token-name">--radius-lg</code>
                </div>
                <div className="example-badge" style={{
                  backgroundColor: 'var(--color-primary-light)',
                  color: 'var(--color-primary-default)',
                  borderRadius: 'var(--radius-full)',
                  padding: 'var(--space-2) var(--space-4)',
                  display: 'inline-block'
                }}>
                  Badge with <code className="token-name">--radius-full</code>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Typography */}
        <section className="demo-section-split">
          <h2>Typography</h2>
          <div className="split-layout">
            <div className="split-tokens">
              <h3 className="split-subtitle">Tokens</h3>
              <div className="typography-demo">
                <div className="typography-item">
                  <h1 style={{ fontSize: 'var(--font-size-heading-xl)' }}>Heading XL</h1>
                  <code className="token-name">--font-size-heading-xl</code>
                </div>
                <div className="typography-item">
                  <h2 style={{ fontSize: 'var(--font-size-heading-lg)' }}>Heading LG</h2>
                  <code className="token-name">--font-size-heading-lg</code>
                </div>
                <div className="typography-item">
                  <h3 style={{ fontSize: 'var(--font-size-heading-md)' }}>Heading MD</h3>
                  <code className="token-name">--font-size-heading-md</code>
                </div>
                <div className="typography-item">
                  <h4 style={{ fontSize: 'var(--font-size-heading-sm)' }}>Heading SM</h4>
                  <code className="token-name">--font-size-heading-sm</code>
                </div>
                <div className="typography-item">
                  <p style={{ fontSize: 'var(--font-size-body-md)' }}>Body MD (default)</p>
                  <code className="token-name">--font-size-body-md</code>
                </div>
                <div className="typography-item">
                  <p style={{ fontSize: 'var(--font-size-body-sm)' }}>Body SM</p>
                  <code className="token-name">--font-size-body-sm</code>
                </div>
                <div className="typography-item">
                  <p style={{ fontSize: 'var(--font-size-body-xs)' }}>Body XS</p>
                  <code className="token-name">--font-size-body-xs</code>
                </div>
              </div>
            </div>
            <div className="split-examples">
              <h3 className="split-subtitle">Examples</h3>
              <div className="examples-container">
                <article className="example-article">
                  <h2 style={{ 
                    fontSize: 'var(--font-size-heading-lg)', 
                    margin: '0 0 var(--space-4) 0',
                    fontWeight: 'var(--font-weight-semibold)'
                  }}>
                    Article Heading
                  </h2>
                  <p style={{ 
                    fontSize: 'var(--font-size-body-md)', 
                    lineHeight: 'var(--line-height-relaxed)',
                    margin: '0 0 var(--space-3) 0',
                    color: 'var(--color-text-secondary)'
                  }}>
                    This is body text using the default font size with relaxed line height for comfortable reading. The modular scale creates clear hierarchy between different text levels.
                  </p>
                  <p style={{ 
                    fontSize: 'var(--font-size-body-sm)', 
                    color: 'var(--color-text-tertiary)',
                    margin: 0
                  }}>
                    Small metadata text • Published 2 hours ago
                  </p>
                </article>
              </div>
            </div>
          </div>
        </section>

        {/* Shadows */}
        <section className="demo-section-split">
          <h2>Shadows</h2>
          <div className="split-layout">
            <div className="split-tokens">
              <h3 className="split-subtitle">Tokens</h3>
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
                    <code className="token-name">--shadow-{size}</code>
                  </div>
                ))}
              </div>
            </div>
            <div className="split-examples">
              <h3 className="split-subtitle">Examples</h3>
              <div className="examples-container">
                <div className="example-card-shadow" style={{
                  backgroundColor: 'var(--color-ui-background-elevated)',
                  borderRadius: 'var(--radius-default)',
                  padding: 'var(--space-6)',
                  boxShadow: 'var(--shadow-default)'
                }}>
                  <h4 style={{ margin: '0 0 var(--space-2) 0' }}>Card with <code className="token-name">--shadow-default</code></h4>
                  <p style={{ margin: 0, color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-body-sm)' }}>
                    Standard elevation for cards
                  </p>
                </div>
                <Button variant="primary" style={{ boxShadow: 'var(--shadow-md)' }}>
                  Button with <code className="token-name">--shadow-md</code>
                </Button>
                <div className="example-dropdown" style={{
                  backgroundColor: 'var(--color-ui-background-elevated)',
                  borderRadius: 'var(--radius-default)',
                  padding: 'var(--space-4)',
                  boxShadow: 'var(--shadow-lg)'
                }}>
                  Dropdown menu (<code className="token-name">--shadow-lg</code>)
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Components */}
        <section className="demo-section-split">
          <h2>Buttons</h2>
          <div className="split-layout">
            <div className="split-tokens">
              <h3 className="split-subtitle">Variants</h3>
              <div className="component-tokens">
                <p style={{ margin: '0 0 var(--space-3) 0', fontSize: 'var(--font-size-body-md)', color: 'var(--color-text-secondary)' }}>
                  Buttons use color, spacing, radius, and shadow tokens
                </p>
                <code className="token-name">
                  padding: <code className="token-name">--space-3</code> <code className="token-name">--space-4</code><br/>
                  border-radius: <code className="token-name">--radius-default</code><br/>
                  font-weight: <code className="token-name">--font-weight-medium</code>
                </code>
              </div>
            </div>
            <div className="split-examples">
              <h3 className="split-subtitle">Examples</h3>
              <div className="examples-container">
                <div style={{ display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap', alignItems: 'center' }}>
                  <Button variant="primary">Primary Button</Button>
                  <Button variant="secondary">Secondary Button</Button>
                  <Button variant="tertiary">Tertiary Button</Button>
                </div>
                <div style={{ display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap', alignItems: 'center' }}>
                  <Button variant="primary" icon="Plus">With Icon</Button>
                  <Button variant="secondary" icon="ArrowRight" iconPosition="right">
                    Icon Right
                  </Button>
                </div>
                <div style={{ display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap', alignItems: 'center' }}>
                  <Button variant="icon" icon="Plus" />
                  <Button variant="icon" icon="Copy" />
                  <Button variant="icon" icon="Settings" />
                  <Button variant="icon" icon="Trash" />
                  <Button variant="icon" icon="Check" />
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default DesignSystemDemo;