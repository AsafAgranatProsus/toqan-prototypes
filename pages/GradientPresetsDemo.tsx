import React from 'react';
import GradientBackground from '../components/GradientBackground';
import { getPresetNames, GRADIENT_PRESETS } from '../configs/gradients/presets';
import './GradientPresetsDemo.css';

/**
 * Demo page to visually test all gradient presets
 * Shows all available presets in a grid layout plus a random preset example
 */
export function GradientPresetsDemo() {
  const presets = getPresetNames();
  
  return (
    <div className="gradient-presets-demo">
      <div className="demo-header">
        <h1>Gradient Presets</h1>
        <p>All available gradient presets with theme-aware colors</p>
      </div>

      <div className="presets-grid">
        {presets.map(preset => {
          const frame = GRADIENT_PRESETS[preset];
          return (
            <div key={preset} className="preset-card">
              <div className="preset-preview">
                <GradientBackground preset={preset} />
              </div>
              <div className="preset-info">
                <h2>{frame.name}</h2>
                <p className="preset-description">{frame.description}</p>
                <div className="preset-tags">
                  {frame.tags?.map(tag => (
                    <span key={tag} className="tag">{tag}</span>
                  ))}
                </div>
                <code className="preset-usage">{`<GradientBackground preset="${preset}" />`}</code>
              </div>
            </div>
          );
        })}
        
        {/* Random preset example */}
        <div className="preset-card">
          <div className="preset-preview">
            <GradientBackground type="organic" />
          </div>
          <div className="preset-info">
            <h2>Random Preset</h2>
            <p className="preset-description">
              When no preset is specified, a random one is selected automatically
            </p>
            <div className="preset-tags">
              <span className="tag">random</span>
              <span className="tag">auto</span>
            </div>
            <code className="preset-usage">{`<GradientBackground type="organic" />`}</code>
          </div>
        </div>
      </div>

      <div className="demo-footer">
        <h3>Usage Instructions</h3>
        <ul>
          <li>All presets automatically adapt to your theme (light/dark mode)</li>
          <li>Simply pass the preset name as a prop - no configuration needed</li>
          <li>Theme colors are resolved dynamically from CSS variables</li>
          <li>Switch between themes to see presets adapt in real-time</li>
        </ul>
      </div>
    </div>
  );
}

export default GradientPresetsDemo;

