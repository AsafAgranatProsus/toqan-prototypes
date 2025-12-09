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

// Theme color tokens available for gradient color stops
const GRADIENT_COLOR_TOKENS = [
  // Primary
  { value: 'primary-default', label: 'Primary', group: 'Primary' },
  { value: 'primary-hover', label: 'Primary Hover', group: 'Primary' },
  { value: 'primary-light', label: 'Primary Light', group: 'Primary' },
  { value: 'primary-background', label: 'Primary Background', group: 'Primary' },
  
  // Secondary
  { value: 'secondary-default', label: 'Secondary', group: 'Secondary' },
  { value: 'secondary-hover', label: 'Secondary Hover', group: 'Secondary' },
  { value: 'secondary-light', label: 'Secondary Light', group: 'Secondary' },
  { value: 'secondary-background', label: 'Secondary Background', group: 'Secondary' },
  
  // Tertiary
  { value: 'tertiary-default', label: 'Tertiary', group: 'Tertiary' },
  { value: 'tertiary-hover', label: 'Tertiary Hover', group: 'Tertiary' },
  { value: 'tertiary-light', label: 'Tertiary Light', group: 'Tertiary' },
  { value: 'tertiary-background', label: 'Tertiary Background', group: 'Tertiary' },
  
  // Surface/Neutral
  { value: 'surface-container', label: 'Surface Container', group: 'Neutral' },
  { value: 'surface-container-low', label: 'Surface Low', group: 'Neutral' },
  { value: 'surface-container-high', label: 'Surface High', group: 'Neutral' },
  { value: 'surface-container-lowest', label: 'Surface Lowest', group: 'Neutral' },
  { value: 'surface-container-highest', label: 'Surface Highest', group: 'Neutral' },
  { value: 'ui-background', label: 'Background', group: 'Neutral' },
  { value: 'ui-background-elevated', label: 'Background Elevated', group: 'Neutral' },
] as const;

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
  const [organicNoiseAlgorithm, setOrganicNoiseAlgorithm] = useState<NoiseAlgorithm>('simplex');
  const [organicColorStops, setOrganicColorStops] = useState<ThemeColorStop[]>([
    { token: 'primary-default', alpha: 1.0, threshold: 0.0 },
    { token: 'secondary-default', alpha: 1.0, threshold: 0.35 },
    { token: 'tertiary-default', alpha: 0.9, threshold: 0.65 },
    { token: 'surface-container', alpha: 0.8, threshold: 0.9 },
  ]);

  // Convert theme tokens to actual colors for preview
  const organicColorsForPreview: ColorStop[] = organicColorStops.map(stop => ({
    color: getColorToken(stop.token),
    alpha: stop.alpha,
    threshold: stop.threshold,
  }));

  // Generate semantic name from color stops
  const generateSemanticName = (colorStops: ThemeColorStop[], algorithm: NoiseAlgorithm): string => {
    // Extract unique base token names (e.g., 'primary', 'secondary')
    const uniqueTokens = [...new Set(
      colorStops.map(stop => stop.token.split('-')[0])
    )];
    
    // Create short name from first 3 unique tokens
    const baseName = uniqueTokens.slice(0, 3).join('-');
    
    // Add algorithm suffix if not the default
    const algoSuffix = algorithm !== 'simplex' ? `-${algorithm}` : '';
    
    return `${baseName}${algoSuffix}`;
  };

  // Helper: Find nearest theme token for a hex color (keep for legacy)
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
    // 1. Auto-generate semantic name
    const autoName = generateSemanticName(organicColorStops, organicNoiseAlgorithm);
    
    // 2. Prompt user with pre-filled name
    const userInput = prompt(
      'Enter gradient name (short, semantic):',
      autoName
    );
    
    if (!userInput) return; // User cancelled
    
    // 3. Sanitize filename (lowercase, hyphens only)
    const filename = userInput
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
    
    // 4. Get optional description
    const description = prompt(
      'Enter description (optional):',
      `${filename.split('-').join(' ')} gradient with theme colors`
    );
    
    // 5. Extract tags from tokens
    const tags = [...new Set([
      ...organicColorStops.map(stop => stop.token.split('-')[0]),
      'theme-colors',
      organicNoiseAlgorithm,
    ])];
    
    // 6. Create frame with theme tokens
    const frame: GradientFrame = {
      id: `${filename}-${Date.now()}`,
      name: filename.split('-').map(w => 
        w.charAt(0).toUpperCase() + w.slice(1)
      ).join(' '),
      description: description || undefined,
      config: {
        seed: organicSeed,
        blurIntensity: organicBlurIntensity,
        noiseScale: organicNoiseScale,
        grainIntensity: organicGrainIntensity,
        iterations: organicIterations,
        noiseAlgorithm: organicNoiseAlgorithm,
        colorStops: organicColorStops,
      },
      tags,
      createdAt: new Date().toISOString().split('T')[0],
      author: 'Gradient Playground',
    };
    
    // 7. Download as JSON
    const blob = new Blob([JSON.stringify(frame, null, 2)], { 
      type: 'application/json' 
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename}.json`;
    a.click();
    URL.revokeObjectURL(url);

    // 8. Show success message with instructions
    alert(
      `Gradient saved as ${filename}.json\n\n` +
      `To use this preset:\n` +
      `1. Move file to: configs/gradients/frames/\n` +
      `2. Add import to: configs/gradients/presets.ts\n` +
      `3. Add to GRADIENT_PRESETS object\n` +
      `4. Use: <GradientBackground preset="${filename}" />\n\n` +
      `Theme tokens used:\n${organicColorStops.map((s, i) => `  Color ${i + 1}: ${s.token}`).join('\n')}`
    );
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
                colors={organicColorsForPreview}
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
                  <h2>Color Palette ({organicColorStops.length} colors)</h2>
                  
                  {organicColorStops.map((colorStop, index) => (
                    <div key={index} className="blob-config" style={{ marginBottom: '1rem', padding: '1rem', border: '1px solid var(--color-outline, #444)', borderRadius: '8px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                        <strong>Color Stop {index + 1}</strong>
                        {organicColorStops.length > 2 && (
                          <button
                            onClick={() => setOrganicColorStops(organicColorStops.filter((_, i) => i !== index))}
                            className="btn-delete"
                            style={{ padding: '0.25rem 0.5rem' }}
                          >
                            Remove
                          </button>
                        )}
                      </div>
                      
                      <div className="control-group">
                        <label>
                          Theme Token
                          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginTop: '0.5rem' }}>
                            <select
                              value={colorStop.token}
                              onChange={(e) => {
                                const newColorStops = [...organicColorStops];
                                newColorStops[index].token = e.target.value;
                                setOrganicColorStops(newColorStops);
                              }}
                              style={{ 
                                flex: 1,
                                padding: '0.5rem', 
                                borderRadius: '6px',
                                border: '1px solid var(--color-outline, #444)',
                                background: 'var(--color-surface-container, #fff)',
                                color: 'var(--color-on-surface, #000)',
                              }}
                            >
                              {GRADIENT_COLOR_TOKENS.map((token) => (
                                <option key={token.value} value={token.value}>
                                  {token.label} ({token.group})
                                </option>
                              ))}
                            </select>
                            <div 
                              className="color-preview"
                              style={{ 
                                width: '40px',
                                height: '40px',
                                borderRadius: '6px',
                                border: '2px solid var(--color-outline, #444)',
                                backgroundColor: getColorToken(colorStop.token),
                                flexShrink: 0,
                              }}
                              title={`${colorStop.token}: ${getColorToken(colorStop.token)}`}
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
                              const newColorStops = [...organicColorStops];
                              newColorStops[index].alpha = Number(e.target.value);
                              setOrganicColorStops(newColorStops);
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
                              const newColorStops = [...organicColorStops];
                              newColorStops[index].threshold = Number(e.target.value);
                              setOrganicColorStops(newColorStops);
                            }}
                          />
                        </label>
                        <small style={{ display: 'block', marginTop: '0.25rem', color: 'var(--color-on-surface-variant, #b3b3b3)' }}>
                          When this color appears (0 = always, 1 = peaks only)
                        </small>
                      </div>
                    </div>
                  ))}

                  {organicColorStops.length < 8 && (
                    <button
                      onClick={() => {
                        const newThreshold = organicColorStops.length > 0 
                          ? Math.min(organicColorStops[organicColorStops.length - 1].threshold + 0.2, 1.0)
                          : 0.0;
                        setOrganicColorStops([
                          ...organicColorStops,
                          { token: 'primary-default', alpha: 0.8, threshold: newThreshold }
                        ]);
                      }}
                      className="btn-add"
                      style={{ width: '100%' }}
                    >
                      + Add Color
                    </button>
                  )}

                  {organicColorStops.length >= 8 && (
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
