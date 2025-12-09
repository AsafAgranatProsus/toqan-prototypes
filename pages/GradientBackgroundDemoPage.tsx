import React, { useState } from 'react';
import GradientBackground, { type OrganicGradientConfig } from '../components/GradientBackground/GradientBackground';
import type { ColorStop, NoiseAlgorithm } from '../components/OrganicGradient/OrganicGradient';
import './GradientBackgroundDemoPage.css';

// Example gradient configurations
const PRESET_GRADIENTS: Record<string, OrganicGradientConfig> = {
  pastelDream: {
    seed: 12,
    blurIntensity: 2.0,
    noiseScale: 3.0,
    grainIntensity: 0.1,
    iterations: 50,
    noiseAlgorithm: 'simplex',
    colors: [
      { color: '#ffd6e7', alpha: 0.9, threshold: 0.0 },
      { color: '#c3b1e1', alpha: 0.85, threshold: 0.4 },
      { color: '#a7d3f0', alpha: 0.8, threshold: 0.7 },
    ],
  },
  vibrantSunset: {
    seed: 42,
    blurIntensity: 1.2,
    noiseScale: 2.0,
    grainIntensity: 0.15,
    iterations: 35,
    noiseAlgorithm: 'fbm',
    colors: [
      { color: '#ff006e', alpha: 1.0, threshold: 0.0 },
      { color: '#fb5607', alpha: 0.9, threshold: 0.3 },
      { color: '#ffbe0b', alpha: 0.85, threshold: 0.6 },
      { color: '#8338ec', alpha: 0.9, threshold: 0.85 },
    ],
  },
  oceanDepths: {
    seed: 7,
    blurIntensity: 1.8,
    noiseScale: 2.5,
    grainIntensity: 0.12,
    iterations: 40,
    noiseAlgorithm: 'perlin',
    colors: [
      { color: '#001233', alpha: 1.0, threshold: 0.0 },
      { color: '#003566', alpha: 1.0, threshold: 0.3 },
      { color: '#0466c8', alpha: 0.9, threshold: 0.6 },
      { color: '#33a1fd', alpha: 0.85, threshold: 0.85 },
    ],
  },
  forestMist: {
    seed: 23,
    blurIntensity: 1.5,
    noiseScale: 2.2,
    grainIntensity: 0.18,
    iterations: 45,
    noiseAlgorithm: 'simplex',
    colors: [
      { color: '#2d6a4f', alpha: 1.0, threshold: 0.0 },
      { color: '#40916c', alpha: 0.95, threshold: 0.35 },
      { color: '#74c69d', alpha: 0.85, threshold: 0.65 },
      { color: '#b7e4c7', alpha: 0.75, threshold: 0.9 },
    ],
  },
  midnight: {
    seed: 99,
    blurIntensity: 1.0,
    noiseScale: 1.8,
    grainIntensity: 0.2,
    iterations: 30,
    noiseAlgorithm: 'value',
    colors: [
      { color: '#0a0a0a', alpha: 1.0, threshold: 0.0 },
      { color: '#1a1a2e', alpha: 1.0, threshold: 0.4 },
      { color: '#16213e', alpha: 0.95, threshold: 0.7 },
      { color: '#0f3460', alpha: 0.9, threshold: 0.9 },
    ],
  },
};

export const GradientBackgroundDemoPage: React.FC = () => {
  const [gradientType, setGradientType] = useState<'blob' | 'organic'>('blob');
  const [selectedPreset, setSelectedPreset] = useState<string>('random');
  const [animate, setAnimate] = useState(true);
  const [animationInterval, setAnimationInterval] = useState(5000);

  // Custom configuration controls
  const [customConfig, setCustomConfig] = useState<OrganicGradientConfig>({
    seed: 0,
    blurIntensity: 1.5,
    noiseScale: 2.0,
    grainIntensity: 0.15,
    iterations: 30,
    noiseAlgorithm: 'simplex',
    colors: [
      { color: '#000000', alpha: 1.0, threshold: 0.0 },
      { color: '#191a66', alpha: 1.0, threshold: 0.3 },
      { color: '#19ccc1', alpha: 0.8, threshold: 0.6 },
      { color: '#cc1980', alpha: 0.8, threshold: 0.85 },
    ],
  });

  const getCurrentConfig = (): OrganicGradientConfig | undefined => {
    if (gradientType === 'blob') return undefined;
    if (selectedPreset === 'random') return undefined;
    if (selectedPreset === 'custom') return customConfig;
    return PRESET_GRADIENTS[selectedPreset];
  };

  const exportConfig = () => {
    const config = getCurrentConfig();
    if (!config) {
      alert('No configuration to export (using random or blob gradient)');
      return;
    }

    const json = JSON.stringify(config, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `gradient-config-${selectedPreset}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="gradient-demo-page">
      {/* Background */}
      <GradientBackground
        type={gradientType}
        config={getCurrentConfig()}
        animate={animate}
        animationInterval={animationInterval}
      />

      {/* Controls Panel */}
      <div className="gradient-demo-controls">
        <h1>GradientBackground Demo</h1>
        
        <section className="control-section">
          <h2>Gradient Type</h2>
          <div className="control-group">
            <label className="radio-label">
              <input
                type="radio"
                checked={gradientType === 'blob'}
                onChange={() => setGradientType('blob')}
              />
              <span>Blob Gradient (CSS)</span>
            </label>
            <label className="radio-label">
              <input
                type="radio"
                checked={gradientType === 'organic'}
                onChange={() => setGradientType('organic')}
              />
              <span>Organic Gradient (WebGL)</span>
            </label>
          </div>
        </section>

        {gradientType === 'organic' && (
          <section className="control-section">
            <h2>Preset Configuration</h2>
            <div className="control-group">
              <select
                value={selectedPreset}
                onChange={(e) => setSelectedPreset(e.target.value)}
                className="preset-select"
              >
                <option value="random">Random (Auto-generated)</option>
                <option value="pastelDream">Pastel Dream</option>
                <option value="vibrantSunset">Vibrant Sunset</option>
                <option value="oceanDepths">Ocean Depths</option>
                <option value="forestMist">Forest Mist</option>
                <option value="midnight">Midnight</option>
                <option value="custom">Custom Configuration</option>
              </select>
            </div>
          </section>
        )}

        <section className="control-section">
          <h2>Animation</h2>
          <div className="control-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={animate}
                onChange={(e) => setAnimate(e.target.checked)}
              />
              <span>Enable Animation</span>
            </label>
          </div>
          {animate && (
            <div className="control-group">
              <label>
                Interval: {animationInterval / 1000}s
                <input
                  type="range"
                  min="1000"
                  max="10000"
                  step="500"
                  value={animationInterval}
                  onChange={(e) => setAnimationInterval(Number(e.target.value))}
                  className="range-input"
                />
              </label>
            </div>
          )}
        </section>

        {gradientType === 'organic' && selectedPreset === 'custom' && (
          <>
            <section className="control-section">
              <h2>Custom Configuration</h2>
              
              <div className="control-group">
                <label>
                  Seed: {customConfig.seed}
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={customConfig.seed}
                    onChange={(e) => setCustomConfig({ ...customConfig, seed: Number(e.target.value) })}
                    className="range-input"
                  />
                </label>
              </div>

              <div className="control-group">
                <label>
                  Blur Intensity: {customConfig.blurIntensity?.toFixed(2)}
                  <input
                    type="range"
                    min="0"
                    max="3"
                    step="0.1"
                    value={customConfig.blurIntensity}
                    onChange={(e) => setCustomConfig({ ...customConfig, blurIntensity: Number(e.target.value) })}
                    className="range-input"
                  />
                </label>
              </div>

              <div className="control-group">
                <label>
                  Noise Scale: {customConfig.noiseScale?.toFixed(1)}
                  <input
                    type="range"
                    min="0.5"
                    max="5"
                    step="0.1"
                    value={customConfig.noiseScale}
                    onChange={(e) => setCustomConfig({ ...customConfig, noiseScale: Number(e.target.value) })}
                    className="range-input"
                  />
                </label>
              </div>

              <div className="control-group">
                <label>
                  Grain Intensity: {customConfig.grainIntensity?.toFixed(2)}
                  <input
                    type="range"
                    min="0"
                    max="0.5"
                    step="0.01"
                    value={customConfig.grainIntensity}
                    onChange={(e) => setCustomConfig({ ...customConfig, grainIntensity: Number(e.target.value) })}
                    className="range-input"
                  />
                </label>
              </div>

              <div className="control-group">
                <label>
                  Iterations: {customConfig.iterations}
                  <input
                    type="range"
                    min="10"
                    max="100"
                    step="5"
                    value={customConfig.iterations}
                    onChange={(e) => setCustomConfig({ ...customConfig, iterations: Number(e.target.value) })}
                    className="range-input"
                  />
                </label>
              </div>

              <div className="control-group">
                <label>
                  Noise Algorithm
                  <select
                    value={customConfig.noiseAlgorithm}
                    onChange={(e) => setCustomConfig({ ...customConfig, noiseAlgorithm: e.target.value as NoiseAlgorithm })}
                    className="preset-select"
                  >
                    <option value="value">Value Noise</option>
                    <option value="simplex">Simplex Noise</option>
                    <option value="perlin">Perlin Noise</option>
                    <option value="fbm">FBM (Fractal)</option>
                  </select>
                </label>
              </div>
            </section>
          </>
        )}

        <section className="control-section">
          <h2>Actions</h2>
          <button 
            onClick={exportConfig}
            className="export-button"
            disabled={gradientType === 'blob' || selectedPreset === 'random'}
          >
            📦 Export Configuration
          </button>
        </section>

        <section className="control-section info-section">
          <h2>Current Configuration</h2>
          <div className="config-display">
            <pre>{JSON.stringify({
              type: gradientType,
              animate,
              animationInterval,
              config: getCurrentConfig() || 'randomized',
            }, null, 2)}</pre>
          </div>
        </section>
      </div>

      {/* Demo Content */}
      <div className="gradient-demo-content">
        <div className="demo-card">
          <h2>GradientBackground Component</h2>
          <p>
            This page demonstrates the GradientBackground component with various 
            configurations and gradient types.
          </p>
          <p>
            Use the controls panel on the left to experiment with different settings.
          </p>
        </div>
      </div>
    </div>
  );
};

export default GradientBackgroundDemoPage;

