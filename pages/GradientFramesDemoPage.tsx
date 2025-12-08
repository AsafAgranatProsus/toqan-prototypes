/**
 * Gradient Frames Demo Page
 * 
 * Demonstrates the theme-aware gradient frame system with live examples.
 */

import React, { useState } from 'react';
import { ThemedGradient } from '../components/ThemedGradient';
import { useGradientFrame } from '../hooks/useGradientFrame';
import { getAllFrames, getAllTags } from '../configs/gradients/registry';
import './GradientFramesDemoPage.css';

export const GradientFramesDemoPage: React.FC = () => {
  const [selectedFrameId, setSelectedFrameId] = useState<string>('hero-abstract-001');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [randomMode, setRandomMode] = useState(false);

  const frames = getAllFrames();
  const allTags = getAllTags();

  // Load frame based on mode
  const { frame, refresh } = useGradientFrame(
    randomMode 
      ? (selectedTags.length > 0 ? selectedTags : undefined)
      : selectedFrameId,
    { refreshOnMount: randomMode }
  );

  const currentFrame = frame || frames[0];

  const toggleTag = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  return (
    <div className="gradient-demo-page">
      <header className="demo-header">
        <h1>🎨 Gradient Frame System Demo</h1>
        <p>Theme-aware gradients that adapt to your design system</p>
      </header>

      <div className="demo-container">
        {/* Sidebar Controls */}
        <aside className="demo-sidebar">
          <section className="demo-section">
            <h2>Mode</h2>
            <div className="mode-toggle">
              <button
                className={!randomMode ? 'active' : ''}
                onClick={() => setRandomMode(false)}
              >
                Specific Frame
              </button>
              <button
                className={randomMode ? 'active' : ''}
                onClick={() => setRandomMode(true)}
              >
                Random
              </button>
            </div>
          </section>

          {!randomMode ? (
            <section className="demo-section">
              <h2>Select Frame</h2>
              <div className="frame-list">
                {frames.map(f => (
                  <button
                    key={f.id}
                    className={selectedFrameId === f.id ? 'active' : ''}
                    onClick={() => setSelectedFrameId(f.id)}
                  >
                    <strong>{f.name}</strong>
                    {f.tags && (
                      <div className="frame-tags">
                        {f.tags.map(tag => (
                          <span key={tag} className="tag">{tag}</span>
                        ))}
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </section>
          ) : (
            <section className="demo-section">
              <h2>Filter by Tags</h2>
              <div className="tag-filters">
                {allTags.map(tag => (
                  <button
                    key={tag}
                    className={selectedTags.includes(tag) ? 'active' : ''}
                    onClick={() => toggleTag(tag)}
                  >
                    {tag}
                  </button>
                ))}
              </div>
              <button
                className="refresh-button"
                onClick={refresh}
              >
                🎲 Randomize
              </button>
            </section>
          )}

          {currentFrame && (
            <section className="demo-section frame-info">
              <h2>Current Frame</h2>
              <dl>
                <dt>Name:</dt>
                <dd>{currentFrame.name}</dd>
                
                <dt>ID:</dt>
                <dd><code>{currentFrame.id}</code></dd>
                
                {currentFrame.description && (
                  <>
                    <dt>Description:</dt>
                    <dd>{currentFrame.description}</dd>
                  </>
                )}
                
                <dt>Algorithm:</dt>
                <dd>{currentFrame.config.noiseAlgorithm}</dd>
                
                <dt>Colors:</dt>
                <dd>{currentFrame.config.colorStops.length} stops</dd>
                
                <dt>Seed:</dt>
                <dd>{currentFrame.config.seed}</dd>
              </dl>
            </section>
          )}

          <section className="demo-section">
            <h2>Theme Tokens</h2>
            {currentFrame && (
              <div className="color-tokens">
                {currentFrame.config.colorStops.map((stop, i) => (
                  <div key={i} className="token-item">
                    <div className="token-info">
                      <strong>Color {i + 1}</strong>
                      <code>{stop.token}</code>
                    </div>
                    <div className="token-meta">
                      <span>α: {stop.alpha.toFixed(2)}</span>
                      <span>t: {stop.threshold.toFixed(2)}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </aside>

        {/* Main Canvas */}
        <main className="demo-main">
          <div className="gradient-preview">
            {currentFrame && <ThemedGradient frame={currentFrame} />}
          </div>

          <div className="preview-overlay">
            <div className="overlay-content">
              <h1>{currentFrame?.name}</h1>
              <p>Theme-aware gradient • Adapts to light/dark mode</p>
            </div>
          </div>
        </main>
      </div>

      <section className="usage-examples">
        <h2>Usage Example</h2>
        <pre>
          <code>{`import { ThemedGradient } from '../components/ThemedGradient';
import { useGradientFrame } from '../hooks/useGradientFrame';

export const MyComponent = () => {
  const { frame } = useGradientFrame('${currentFrame?.id}');
  
  return frame && <ThemedGradient frame={frame} />;
};`}</code>
        </pre>
      </section>
    </div>
  );
};

export default GradientFramesDemoPage;
