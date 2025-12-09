import React from 'react';
import GradientBackground, { type OrganicGradientConfig } from '../components/GradientBackground/GradientBackground';

/**
 * Example configurations for the GradientBackground component
 * 
 * Copy these examples into your own code to use different gradient styles
 */

// Example 1: Default blob gradient (original behavior)
export const Example1_DefaultBlob = () => {
  return (
    <div style={{ position: 'relative', height: '100vh' }}>
      <GradientBackground />
      <div style={{ position: 'relative', zIndex: 1, padding: '2rem' }}>
        <h1>Default Blob Gradient</h1>
        <p>The original animated blob gradient with theme-aware colors.</p>
      </div>
    </div>
  );
};

// Example 2: Random organic gradient
export const Example2_RandomOrganic = () => {
  return (
    <div style={{ position: 'relative', height: '100vh' }}>
      <GradientBackground type="organic" />
      <div style={{ position: 'relative', zIndex: 1, padding: '2rem' }}>
        <h1>Random Organic Gradient</h1>
        <p>A randomized WebGL gradient with noise-based patterns.</p>
      </div>
    </div>
  );
};

// Example 3: Custom organic gradient with specific colors
const customConfig: OrganicGradientConfig = {
  seed: 42,
  blurIntensity: 1.5,
  noiseScale: 2.5,
  grainIntensity: 0.2,
  iterations: 40,
  noiseAlgorithm: 'simplex',
  colors: [
    { color: '#191a66', alpha: 1.0, threshold: 0.0 },
    { color: '#19ccc1', alpha: 0.9, threshold: 0.4 },
    { color: '#cc1980', alpha: 0.85, threshold: 0.75 },
  ],
};

export const Example3_CustomOrganic = () => {
  return (
    <div style={{ position: 'relative', height: '100vh' }}>
      <GradientBackground type="organic" config={customConfig} />
      <div style={{ position: 'relative', zIndex: 1, padding: '2rem' }}>
        <h1>Custom Organic Gradient</h1>
        <p>A deterministic gradient with specific colors and parameters.</p>
      </div>
    </div>
  );
};

// Example 4: Animated organic gradient
export const Example4_AnimatedOrganic = () => {
  return (
    <div style={{ position: 'relative', height: '100vh' }}>
      <GradientBackground 
        type="organic" 
        animate={true} 
        animationInterval={3000}
        config={customConfig}
      />
      <div style={{ position: 'relative', zIndex: 1, padding: '2rem' }}>
        <h1>Animated Organic Gradient</h1>
        <p>The gradient smoothly changes every 3 seconds.</p>
      </div>
    </div>
  );
};

// Example 5: Static blob gradient (no animation)
export const Example5_StaticBlob = () => {
  return (
    <div style={{ position: 'relative', height: '100vh' }}>
      <GradientBackground type="blob" animate={false} />
      <div style={{ position: 'relative', zIndex: 1, padding: '2rem' }}>
        <h1>Static Blob Gradient</h1>
        <p>A frozen blob gradient without animation.</p>
      </div>
    </div>
  );
};

// Example 6: Pastel dream preset
const pastelDream: OrganicGradientConfig = {
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
};

export const Example6_PastelDream = () => {
  return (
    <div style={{ position: 'relative', height: '100vh' }}>
      <GradientBackground type="organic" config={pastelDream} />
      <div style={{ position: 'relative', zIndex: 1, padding: '2rem' }}>
        <h1>Pastel Dream</h1>
        <p>Soft, dreamy pastel colors with smooth blending.</p>
      </div>
    </div>
  );
};

// Example 7: Vibrant sunset preset
const vibrantSunset: OrganicGradientConfig = {
  seed: 7,
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
};

export const Example7_VibrantSunset = () => {
  return (
    <div style={{ position: 'relative', height: '100vh' }}>
      <GradientBackground type="organic" config={vibrantSunset} />
      <div style={{ position: 'relative', zIndex: 1, padding: '2rem', color: 'white' }}>
        <h1>Vibrant Sunset</h1>
        <p>Bold, energetic colors inspired by a tropical sunset.</p>
      </div>
    </div>
  );
};

// Example 8: Ocean depths preset
const oceanDepths: OrganicGradientConfig = {
  seed: 23,
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
};

export const Example8_OceanDepths = () => {
  return (
    <div style={{ position: 'relative', height: '100vh' }}>
      <GradientBackground type="organic" config={oceanDepths} />
      <div style={{ position: 'relative', zIndex: 1, padding: '2rem', color: 'white' }}>
        <h1>Ocean Depths</h1>
        <p>Deep blue tones reminiscent of the ocean floor.</p>
      </div>
    </div>
  );
};

// Example 9: Using with imported gradient frame from playground
// This example shows how to use an exported gradient configuration
export const Example9_ImportedFrame = () => {
  // In a real app, you would import like this:
  // import myGradient from './gradients/my-gradient.json';
  
  // For this example, we'll use a mock frame
  const mockGradientFrame = {
    config: {
      seed: 55,
      blurIntensity: 1.3,
      noiseScale: 2.2,
      grainIntensity: 0.18,
      iterations: 30,
      noiseAlgorithm: 'value' as const,
      colorStops: [
        { token: 'primary-default', alpha: 1.0, threshold: 0.0 },
        { token: 'secondary-default', alpha: 0.9, threshold: 0.5 },
        { token: 'tertiary-default', alpha: 0.85, threshold: 0.8 },
      ],
    },
  };

  // Convert theme tokens to actual colors
  // In a real app, use gradientFrameToConfig from utils/gradientUtils
  const configWithColors: OrganicGradientConfig = {
    ...mockGradientFrame.config,
    colors: [
      { color: '#6750A4', alpha: 1.0, threshold: 0.0 },
      { color: '#625B71', alpha: 0.9, threshold: 0.5 },
      { color: '#7D5260', alpha: 0.85, threshold: 0.8 },
    ],
  };

  return (
    <div style={{ position: 'relative', height: '100vh' }}>
      <GradientBackground type="organic" config={configWithColors} />
      <div style={{ position: 'relative', zIndex: 1, padding: '2rem', color: 'white' }}>
        <h1>Imported Gradient Frame</h1>
        <p>Using a configuration exported from the Gradient Playground.</p>
      </div>
    </div>
  );
};

// Example 10: Performance-optimized gradient (lower iterations)
const performanceConfig: OrganicGradientConfig = {
  seed: 10,
  blurIntensity: 1.0,
  noiseScale: 2.0,
  grainIntensity: 0.12,
  iterations: 20, // Lower for better performance
  noiseAlgorithm: 'value',
  colors: [
    { color: '#1a1a2e', alpha: 1.0, threshold: 0.0 },
    { color: '#16213e', alpha: 1.0, threshold: 0.5 },
    { color: '#0f3460', alpha: 0.9, threshold: 0.8 },
  ],
};

export const Example10_Performance = () => {
  return (
    <div style={{ position: 'relative', height: '100vh' }}>
      <GradientBackground type="organic" config={performanceConfig} />
      <div style={{ position: 'relative', zIndex: 1, padding: '2rem', color: 'white' }}>
        <h1>Performance-Optimized</h1>
        <p>Lower iterations (20) for better performance on mobile devices.</p>
      </div>
    </div>
  );
};

// Gallery component showing all examples
export const GradientExamplesGallery = () => {
  const examples = [
    { component: Example1_DefaultBlob, title: 'Default Blob' },
    { component: Example2_RandomOrganic, title: 'Random Organic' },
    { component: Example3_CustomOrganic, title: 'Custom Organic' },
    { component: Example4_AnimatedOrganic, title: 'Animated Organic' },
    { component: Example5_StaticBlob, title: 'Static Blob' },
    { component: Example6_PastelDream, title: 'Pastel Dream' },
    { component: Example7_VibrantSunset, title: 'Vibrant Sunset' },
    { component: Example8_OceanDepths, title: 'Ocean Depths' },
    { component: Example9_ImportedFrame, title: 'Imported Frame' },
    { component: Example10_Performance, title: 'Performance' },
  ];

  return (
    <div style={{ padding: '2rem' }}>
      <h1>GradientBackground Examples</h1>
      <p>Click on any example to view it full-screen</p>
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
        gap: '1rem',
        marginTop: '2rem'
      }}>
        {examples.map((example, index) => (
          <div 
            key={index}
            style={{
              height: '200px',
              position: 'relative',
              borderRadius: '8px',
              overflow: 'hidden',
              cursor: 'pointer',
              border: '2px solid #ddd'
            }}
          >
            <example.component />
          </div>
        ))}
      </div>
    </div>
  );
};

