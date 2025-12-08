import React, { useState } from 'react';
import { StaticGradientCanvas, type BlobConfig } from '../components/StaticGradientCanvas';
import { NoiseGradient } from '../components/NoiseGradient';
import { BokehGradient } from '../components/BokehGradient';
import { OrganicGradient, type ColorStop, type NoiseAlgorithm } from '../components/OrganicGradient';
import { useThemeColors, AVAILABLE_COLOR_TOKENS } from '../hooks/useThemeColors';
import type { GradientFrame, ThemeColorStop } from '../types/gradientFrame';
import './GradientPlaygroundPage.css';

type GradientComponentType = 'static-gradient' | 'noise-gradient' | 'bokeh-gradient' | 'organic-gradient';

type BlendMode = 
  | 'source-over'
  | 'multiply'
  | 'screen'
  | 'overlay'
  | 'darken'
  | 'lighten'
  | 'color-dodge'
  | 'color-burn'
  | 'hard-light'
  | 'soft-light'
  | 'difference'
  | 'exclusion'
  | 'hue'
  | 'saturation'
  | 'color'
  | 'luminosity';

type ShapeType = 'circle' | 'triangle' | 'rectangle';

// Define the extended BlobConfig that matches the component's interface
interface ExtendedBlobConfig extends BlobConfig {
  id: string;
}

const BLEND_MODES: BlendMode[] = [
  'source-over',
  'multiply',
  'screen',
  'overlay',
  'darken',
  'lighten',
  'color-dodge',
  'color-burn',
  'hard-light',
  'soft-light',
  'difference',
  'exclusion',
  'hue',
  'saturation',
  'color',
  'luminosity',
];

const SHAPE_TYPES: ShapeType[] = ['circle', 'triangle', 'rectangle'];

const DEFAULT_BLOBS: ExtendedBlobConfig[] = [
  {
    id: '1',
    x: 0.3,
    y: 0.4,
    size: 300,
    color: '#ff6b6b',
    shape: 'circle',
    rotation: 0,
  },
  {
    id: '2',
    x: 0.7,
    y: 0.6,
    size: 250,
    color: '#4ecdc4',
    shape: 'circle',
    rotation: 0,
  },
  {
    id: '3',
    x: 0.5,
    y: 0.5,
    size: 200,
    color: '#ffe66d',
    shape: 'circle',
    rotation: Math.PI / 4,
  },
];

export const GradientPlaygroundPage: React.FC = () => {
  const [selectedComponent, setSelectedComponent] = useState<GradientComponentType>('static-gradient');
  const { getColorToken } = useThemeColors();
  
  // Static Gradient controls
  const [canvasWidth, setCanvasWidth] = useState(1200);
  const [canvasHeight, setCanvasHeight] = useState(800);
  const [backgroundColor, setBackgroundColor] = useState('#1a1a2e');
  const [blendMode, setBlendMode] = useState<BlendMode>('screen');
  const [blur, setBlur] = useState(80);
  const [grain, setGrain] = useState(0.15);
  const [blobs, setBlobs] = useState<ExtendedBlobConfig[]>(DEFAULT_BLOBS);

  // Organic Gradient controls
  const [organicSeed, setOrganicSeed] = useState(0);
  const [organicBlurIntensity, setOrganicBlurIntensity] = useState(1.0);
  const [organicNoiseScale, setOrganicNoiseScale] = useState(2.0);
  const [organicGrainIntensity, setOrganicGrainIntensity] = useState(0.15);
  const [organicIterations, setOrganicIterations] = useState(30);
  const [organicNoiseAlgorithm, setOrganicNoiseAlgorithm] = useState<NoiseAlgorithm>('value');
  const [organicColors, setOrganicColors] = useState<ColorStop[]>([
    { color: '#000000', alpha: 1.0, threshold: 0.0 },
    { color: '#191a66', alpha: 1.0, threshold: 0.3 },
    { color: '#19ccc1', alpha: 0.8, threshold: 0.6 },
    { color: '#cc1980', alpha: 0.8, threshold: 0.85 },
  ]);

  // Helper: Find nearest theme token for a hex color
  const findNearestToken = (hexColor: string): string => {
    // Convert hex to RGB
    const hex = hexColor.replace('#', '');
    const r1 = parseInt(hex.substring(0, 2), 16);
    const g1 = parseInt(hex.substring(2, 4), 16);
    const b1 = parseInt(hex.substring(4, 6), 16);

    let nearestToken = 'surface-container';
    let minDistance = Infinity;

    // Check all theme tokens
    AVAILABLE_COLOR_TOKENS.forEach(token => {
      try {
        const tokenHex = getColorToken(token);
        const hex2 = tokenHex.replace('#', '');
        const r2 = parseInt(hex2.substring(0, 2), 16);
        const g2 = parseInt(hex2.substring(2, 4), 16);
        const b2 = parseInt(hex2.substring(4, 6), 16);

        // Calculate color distance (Euclidean distance in RGB space)
        const distance = Math.sqrt(
          Math.pow(r1 - r2, 2) +
          Math.pow(g1 - g2, 2) +
          Math.pow(b1 - b2, 2)
        );

        if (distance < minDistance) {
          minDistance = distance;
          nearestToken = token;
        }
      } catch (error) {
        // Skip tokens that can't be resolved
      }
    });

    return nearestToken;
  };

  // Export Organic Gradient as themed frame
  const exportOrganicFrame = () => {
    const frameName = prompt('Enter frame name:', 'My Gradient') || 'Untitled';
    const frameDescription = prompt('Enter description (optional):', '') || undefined;
    const frameTags = prompt('Enter tags (comma-separated, optional):', '')?.split(',').map(t => t.trim()).filter(Boolean);

    // Map colors to nearest theme tokens
    const colorStops: ThemeColorStop[] = organicColors.map(stop => ({
      token: findNearestToken(stop.color),
      alpha: stop.alpha,
      threshold: stop.threshold,
    }));

    const frame: GradientFrame = {
      id: `gradient-${Date.now()}`,
      name: frameName,
      description: frameDescription,
      config: {
        seed: organicSeed,
        blurIntensity: organicBlurIntensity,
        noiseScale: organicNoiseScale,
        grainIntensity: organicGrainIntensity,
        iterations: organicIterations,
        noiseAlgorithm: organicNoiseAlgorithm,
        colorStops,
      },
      tags: frameTags,
      createdAt: new Date().toISOString().split('T')[0],
      author: 'Gradient Playground',
    };

    // Download as JSON
    const blob = new Blob([JSON.stringify(frame, null, 2)], { 
      type: 'application/json' 
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${frame.id}.json`;
    a.click();
    URL.revokeObjectURL(url);

    alert(`Frame exported!\n\nDetected theme tokens:\n${colorStops.map((s, i) => `Color ${i + 1}: ${s.token}`).join('\n')}`);
  };

  const addBlob = () => {
    const newBlob: ExtendedBlobConfig = {
      id: Date.now().toString(),
      x: Math.random(),
      y: Math.random(),
      size: 200,
      color: `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`,
      shape: 'circle',
      rotation: 0,
    };
    setBlobs([...blobs, newBlob]);
  };

  const removeBlob = (id: string) => {
    setBlobs(blobs.filter(blob => blob.id !== id));
  };

  const updateBlob = (id: string, updates: Partial<ExtendedBlobConfig>) => {
    setBlobs(blobs.map(blob => 
      blob.id === id ? { ...blob, ...updates } : blob
    ));
  };

  const exportConfig = () => {
    const config = {
      width: canvasWidth,
      height: canvasHeight,
      backgroundColor,
      blendMode,
      blur,
      grain,
      blobs: blobs.map(({ id, ...rest }) => rest),
    };
    
    const json = JSON.stringify(config, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'gradient-config.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="gradient-playground">
      <div className="playground-header">
        <h1>Gradient Playground</h1>
        <p>Create beautiful gradient backgrounds with different rendering techniques</p>
        
        <div className="component-selector">
          <label>
            Gradient Component
            <select
              value={selectedComponent}
              onChange={(e) => setSelectedComponent(e.target.value as GradientComponentType)}
              className="component-select"
            >
              <option value="static-gradient">Static Gradient Canvas</option>
              <option value="noise-gradient">Noise Gradient (WebGL)</option>
              <option value="bokeh-gradient">Bokeh Gradient (WebGL)</option>
              <option value="organic-gradient">Organic Gradient (WebGL)</option>
            </select>
          </label>
        </div>
      </div>

      <div className="playground-layout">
        <div className="canvas-container">
          {selectedComponent === 'static-gradient' ? (
            <StaticGradientCanvas
              width={canvasWidth}
              height={canvasHeight}
              backgroundColor={backgroundColor}
              blendMode={blendMode}
              blur={blur}
              grain={grain}
              blobs={blobs}
            />
          ) : selectedComponent === 'noise-gradient' ? (
            <div className="noise-gradient-wrapper">
              <NoiseGradient />
            </div>
          ) : selectedComponent === 'bokeh-gradient' ? (
            <div className="noise-gradient-wrapper">
              <BokehGradient />
            </div>
          ) : (
            <div className="organic-gradient-canvas">
              <OrganicGradient 
                seed={organicSeed}
                blurIntensity={organicBlurIntensity}
                noiseScale={organicNoiseScale}
                grainIntensity={organicGrainIntensity}
                iterations={organicIterations}
                colors={organicColors}
                noiseAlgorithm={organicNoiseAlgorithm}
              />
            </div>
          )}
        </div>

        {(selectedComponent === 'static-gradient' || selectedComponent === 'organic-gradient') && (
          <div className="controls-panel">
            {selectedComponent === 'static-gradient' ? (
              <>
                <section className="control-section">
                  <h2>Canvas Settings</h2>
                  <div className="control-group">
              <label>
                Width: {canvasWidth}px
                <input
                  type="range"
                  min="400"
                  max="2000"
                  value={canvasWidth}
                  onChange={(e) => setCanvasWidth(Number(e.target.value))}
                />
              </label>
            </div>
            <div className="control-group">
              <label>
                Height: {canvasHeight}px
                <input
                  type="range"
                  min="300"
                  max="1500"
                  value={canvasHeight}
                  onChange={(e) => setCanvasHeight(Number(e.target.value))}
                />
              </label>
            </div>
            <div className="control-group">
              <label>
                Background Color
                <div className="color-input-group">
                  <input
                    type="color"
                    value={backgroundColor}
                    onChange={(e) => setBackgroundColor(e.target.value)}
                  />
                  <input
                    type="text"
                    value={backgroundColor}
                    onChange={(e) => setBackgroundColor(e.target.value)}
                  />
                </div>
              </label>
            </div>
          </section>

          <section className="control-section">
            <h2>Effects</h2>
            <div className="control-group">
              <label>
                Blend Mode
                <select
                  value={blendMode}
                  onChange={(e) => setBlendMode(e.target.value as BlendMode)}
                >
                  {BLEND_MODES.map(mode => (
                    <option key={mode} value={mode}>{mode}</option>
                  ))}
                </select>
              </label>
            </div>
            <div className="control-group">
              <label>
                Blur: {blur}px
                <input
                  type="range"
                  min="0"
                  max="200"
                  value={blur}
                  onChange={(e) => setBlur(Number(e.target.value))}
                />
              </label>
            </div>
            <div className="control-group">
              <label>
                Grain: {grain.toFixed(2)}
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={grain}
                  onChange={(e) => setGrain(Number(e.target.value))}
                />
              </label>
            </div>
          </section>

          <section className="control-section">
            <div className="section-header">
              <h2>Blobs ({blobs.length})</h2>
              <button onClick={addBlob} className="btn-add">+ Add Blob</button>
            </div>
            
            <div className="blobs-list">
              {blobs.map((blob, index) => (
                <div key={blob.id} className="blob-control">
                  <div className="blob-header">
                    <h3>Blob {index + 1}</h3>
                    <button 
                      onClick={() => removeBlob(blob.id)}
                      className="btn-remove"
                      disabled={blobs.length === 1}
                    >
                      Remove
                    </button>
                  </div>
                  
                  <div className="control-group">
                    <label>
                      Color
                      <div className="color-input-group">
                        <input
                          type="color"
                          value={blob.color}
                          onChange={(e) => updateBlob(blob.id, { color: e.target.value })}
                        />
                        <input
                          type="text"
                          value={blob.color}
                          onChange={(e) => updateBlob(blob.id, { color: e.target.value })}
                        />
                      </div>
                    </label>
                  </div>

                  <div className="control-group">
                    <label>
                      Shape
                      <select
                        value={blob.shape}
                        onChange={(e) => updateBlob(blob.id, { shape: e.target.value as ShapeType })}
                      >
                        {SHAPE_TYPES.map(shape => (
                          <option key={shape} value={shape}>{shape}</option>
                        ))}
                      </select>
                    </label>
                  </div>

                  <div className="control-group">
                    <label>
                      X: {(blob.x * 100).toFixed(0)}%
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.01"
                        value={blob.x}
                        onChange={(e) => updateBlob(blob.id, { x: Number(e.target.value) })}
                      />
                    </label>
                  </div>

                  <div className="control-group">
                    <label>
                      Y: {(blob.y * 100).toFixed(0)}%
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.01"
                        value={blob.y}
                        onChange={(e) => updateBlob(blob.id, { y: Number(e.target.value) })}
                      />
                    </label>
                  </div>

                  <div className="control-group">
                    <label>
                      Size: {blob.size}px
                      <input
                        type="range"
                        min="50"
                        max="800"
                        value={blob.size}
                        onChange={(e) => updateBlob(blob.id, { size: Number(e.target.value) })}
                      />
                    </label>
                  </div>

                  <div className="control-group">
                    <label>
                      Rotation: {(blob.rotation * (180 / Math.PI)).toFixed(0)}°
                      <input
                        type="range"
                        min="0"
                        max={Math.PI * 2}
                        step="0.1"
                        value={blob.rotation}
                        onChange={(e) => updateBlob(blob.id, { rotation: Number(e.target.value) })}
                      />
                    </label>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="control-section">
            <button onClick={exportConfig} className="btn-export">
              Export Configuration
            </button>
          </section>
              </>
            ) : (
              <>
                <section className="control-section">
                  <h2>Organic Gradient Settings</h2>
                  
                  <div className="control-group">
                    <label>
                      Noise Algorithm
                      <select
                        value={organicNoiseAlgorithm}
                        onChange={(e) => setOrganicNoiseAlgorithm(e.target.value as NoiseAlgorithm)}
                        style={{ width: '100%', padding: '0.5rem', marginTop: '0.5rem' }}
                      >
                        <option value="value">Value Noise (Classic)</option>
                        <option value="simplex">Simplex Noise (Smooth)</option>
                        <option value="perlin">Perlin Noise (Natural)</option>
                        <option value="fbm">FBM (Fractal/Detailed)</option>
                      </select>
                    </label>
                    <small style={{ display: 'block', marginTop: '0.25rem', color: 'var(--color-on-surface-variant, #b3b3b3)' }}>
                      Different algorithms produce unique patterns
                    </small>
                  </div>
                  
                  <div className="control-group">
                    <label>
                      Seed: {organicSeed}
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={organicSeed}
                        onChange={(e) => setOrganicSeed(Number(e.target.value))}
                      />
                    </label>
                    <button 
                      onClick={() => setOrganicSeed(Math.floor(Math.random() * 100))}
                      className="btn-add"
                      style={{ marginTop: '0.5rem', width: '100%' }}
                    >
                      Randomize Seed
                    </button>
                  </div>

                  <div className="control-group">
                    <label>
                      Blur Intensity: {organicBlurIntensity.toFixed(2)}
                      <input
                        type="range"
                        min="0"
                        max="3"
                        step="0.1"
                        value={organicBlurIntensity}
                        onChange={(e) => setOrganicBlurIntensity(Number(e.target.value))}
                      />
                    </label>
                  </div>

                  <div className="control-group">
                    <label>
                      Noise Scale: {organicNoiseScale.toFixed(1)}
                      <input
                        type="range"
                        min="0.5"
                        max="5"
                        step="0.1"
                        value={organicNoiseScale}
                        onChange={(e) => setOrganicNoiseScale(Number(e.target.value))}
                      />
                    </label>
                  </div>

                  <div className="control-group">
                    <label>
                      Grain Intensity: {organicGrainIntensity.toFixed(2)}
                      <input
                        type="range"
                        min="0"
                        max="0.5"
                        step="0.01"
                        value={organicGrainIntensity}
                        onChange={(e) => setOrganicGrainIntensity(Number(e.target.value))}
                      />
                    </label>
                  </div>

                  <div className="control-group">
                    <label>
                      Iterations (Quality): {organicIterations}
                      <input
                        type="range"
                        min="10"
                        max="100"
                        step="5"
                        value={organicIterations}
                        onChange={(e) => setOrganicIterations(Number(e.target.value))}
                      />
                    </label>
                    <small style={{ display: 'block', marginTop: '0.25rem', color: 'var(--color-on-surface-variant, #b3b3b3)' }}>
                      Higher = smoother but slower render
                    </small>
                  </div>
                </section>

                <section className="control-section">
                  <h2>Color Palette ({organicColors.length} colors)</h2>
                  
                  {organicColors.map((colorStop, index) => (
                    <div key={index} className="blob-config" style={{ marginBottom: '1rem', padding: '1rem', border: '1px solid var(--color-outline, #444)', borderRadius: '8px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                        <strong>Color {index + 1}</strong>
                        {organicColors.length > 2 && (
                          <button
                            onClick={() => setOrganicColors(organicColors.filter((_, i) => i !== index))}
                            className="btn-delete"
                            style={{ padding: '0.25rem 0.5rem' }}
                          >
                            Remove
                          </button>
                        )}
                      </div>
                      
                      <div className="control-group">
                        <label>
                          Color
                          <div className="color-input-group">
                            <input
                              type="color"
                              value={colorStop.color}
                              onChange={(e) => {
                                const newColors = [...organicColors];
                                newColors[index].color = e.target.value;
                                setOrganicColors(newColors);
                              }}
                            />
                            <input
                              type="text"
                              value={colorStop.color}
                              onChange={(e) => {
                                const newColors = [...organicColors];
                                newColors[index].color = e.target.value;
                                setOrganicColors(newColors);
                              }}
                            />
                          </div>
                        </label>
                      </div>

                      <div className="control-group">
                        <label>
                          Alpha (Opacity): {colorStop.alpha.toFixed(2)}
                          <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.01"
                            value={colorStop.alpha}
                            onChange={(e) => {
                              const newColors = [...organicColors];
                              newColors[index].alpha = Number(e.target.value);
                              setOrganicColors(newColors);
                            }}
                          />
                        </label>
                      </div>

                      <div className="control-group">
                        <label>
                          Threshold: {colorStop.threshold.toFixed(2)}
                          <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.01"
                            value={colorStop.threshold}
                            onChange={(e) => {
                              const newColors = [...organicColors];
                              newColors[index].threshold = Number(e.target.value);
                              setOrganicColors(newColors);
                            }}
                          />
                        </label>
                        <small style={{ display: 'block', marginTop: '0.25rem', color: 'var(--color-on-surface-variant, #b3b3b3)' }}>
                          When this color appears (0 = always, 1 = peaks only)
                        </small>
                      </div>
                    </div>
                  ))}

                  {organicColors.length < 8 && (
                    <button
                      onClick={() => {
                        const newThreshold = organicColors.length > 0 
                          ? Math.min(organicColors[organicColors.length - 1].threshold + 0.2, 1.0)
                          : 0.0;
                        setOrganicColors([
                          ...organicColors,
                          { color: '#ff00ff', alpha: 0.8, threshold: newThreshold }
                        ]);
                      }}
                      className="btn-add"
                      style={{ width: '100%' }}
                    >
                      + Add Color
                    </button>
                  )}

                  {organicColors.length >= 8 && (
                    <small style={{ display: 'block', color: 'var(--color-on-surface-variant, #b3b3b3)', textAlign: 'center' }}>
                      Maximum 8 colors
                    </small>
                  )}
                </section>

                <section className="control-section">
                  <h2>About Organic Gradient</h2>
                  <p style={{ fontSize: '0.875rem', lineHeight: '1.5', color: 'var(--color-on-surface-variant, #b3b3b3)' }}>
                    Static gradient with noise-driven blur and organic color blobs. Supports dynamic colors with alpha blending.
                  </p>
                  <ul style={{ fontSize: '0.875rem', lineHeight: '1.6', color: 'var(--color-on-surface-variant, #b3b3b3)', marginTop: '1rem', paddingLeft: '1.25rem' }}>
                    <li><strong>Algorithm:</strong> Choose noise pattern style</li>
                    <li><strong>Seed:</strong> Changes pattern variation</li>
                    <li><strong>Colors:</strong> Add/remove up to 8 colors</li>
                    <li><strong>Alpha:</strong> Transparency per color</li>
                    <li><strong>Threshold:</strong> When color appears</li>
                  </ul>
                </section>

                <section className="control-section">
                  <h2>Export Frame</h2>
                  <p style={{ fontSize: '0.875rem', lineHeight: '1.5', color: 'var(--color-on-surface-variant, #b3b3b3)', marginBottom: '1rem' }}>
                    Export this gradient as a theme-aware frame that can be reused anywhere in your app.
                  </p>
                  <button 
                    onClick={exportOrganicFrame} 
                    className="btn-export"
                    style={{ width: '100%' }}
                  >
                    📦 Export as Themed Frame
                  </button>
                  <small style={{ display: 'block', marginTop: '0.5rem', color: 'var(--color-on-surface-variant, #b3b3b3)', textAlign: 'center' }}>
                    Colors will be mapped to nearest theme tokens
                  </small>
                </section>
              </>
            )}
        </div>
        )}
      </div>
    </div>
  );
};

export default GradientPlaygroundPage;
