import React, { useRef, useEffect } from 'react';

// Type definitions
type ShapeType = 'circle' | 'triangle' | 'rectangle';

type BlendMode = 
  | 'source-over'
  | 'source-in'
  | 'source-out'
  | 'source-atop'
  | 'destination-over'
  | 'destination-in'
  | 'destination-out'
  | 'destination-atop'
  | 'lighter'
  | 'copy'
  | 'xor'
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

export interface BlobConfig {
  x: number; // Percent (0-1) or pixel value
  y: number; // Percent (0-1) or pixel value
  size: number; // Radius or width
  color: string;
  shape: ShapeType;
  rotation: number; // In radians
}

interface StaticGradientCanvasProps {
  width: number;
  height: number;
  backgroundColor: string;
  blendMode: BlendMode; // Global blend mode for the blobs against the background
  blur: number; // Pixel amount
  grain: number; // Opacity 0-1 or Intensity 0-20
  blobs: BlobConfig[];
}

// Helper function to convert normalized coordinates (0-1) to pixels
const normalizeCoordinate = (value: number, max: number): number => {
  return value <= 1 ? value * max : value;
};

// Helper function to draw a circle
const drawCircle = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
  rotation: number
): void => {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rotation);
  ctx.beginPath();
  ctx.arc(0, 0, size, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
};

// Helper function to draw a rectangle
const drawRectangle = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
  rotation: number
): void => {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rotation);
  ctx.beginPath();
  ctx.rect(-size / 2, -size / 2, size, size);
  ctx.fill();
  ctx.restore();
};

// Helper function to draw an equilateral triangle
const drawTriangle = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
  rotation: number
): void => {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rotation);
  
  const height = (size * Math.sqrt(3)) / 2;
  const halfSize = size / 2;
  
  ctx.beginPath();
  // Top vertex
  ctx.moveTo(0, -height / 1.5);
  // Bottom left vertex
  ctx.lineTo(-halfSize, height / 3);
  // Bottom right vertex
  ctx.lineTo(halfSize, height / 3);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
};

// Helper function to generate grain/noise effect
const generateGrainPattern = (
  width: number,
  height: number,
  intensity: number
): ImageData => {
  const offscreenCanvas = document.createElement('canvas');
  offscreenCanvas.width = width;
  offscreenCanvas.height = height;
  const offscreenCtx = offscreenCanvas.getContext('2d');
  
  if (!offscreenCtx) {
    throw new Error('Failed to get offscreen canvas context');
  }
  
  const imageData = offscreenCtx.createImageData(width, height);
  const data = imageData.data;
  
  // Normalize intensity to 0-1 range if it's in 0-20 range
  const normalizedIntensity = intensity > 1 ? intensity / 20 : intensity;
  
  for (let i = 0; i < data.length; i += 4) {
    // Generate noise around middle gray (128) for better blending
    const noise = (Math.random() - 0.5) * 255 * normalizedIntensity;
    const grayValue = 128 + noise;
    
    data[i] = grayValue;     // R
    data[i + 1] = grayValue; // G
    data[i + 2] = grayValue; // B
    data[i + 3] = 255;       // Full opacity - we'll control opacity with globalAlpha
  }
  
  return imageData;
};

export const StaticGradientCanvas: React.FC<StaticGradientCanvasProps> = ({
  width,
  height,
  backgroundColor,
  blendMode,
  blur,
  grain,
  blobs,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;
    
    // Handle high DPI screens
    const dpr = window.devicePixelRatio || 1;
    
    // Set canvas size accounting for device pixel ratio
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    
    // Scale the context to match
    ctx.scale(dpr, dpr);
    
    // Set CSS size to maintain proper display size
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    // Step 1: Fill background with solid color
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, width, height);
    
    // Step 2: Apply global blur and blend mode for blobs
    ctx.filter = `blur(${blur}px)`;
    ctx.globalCompositeOperation = blendMode;
    
    // Step 3: Draw all blobs
    blobs.forEach((blob) => {
      const x = normalizeCoordinate(blob.x, width);
      const y = normalizeCoordinate(blob.y, height);
      
      ctx.fillStyle = blob.color;
      
      switch (blob.shape) {
        case 'circle':
          drawCircle(ctx, x, y, blob.size, blob.rotation);
          break;
        case 'rectangle':
          drawRectangle(ctx, x, y, blob.size, blob.rotation);
          break;
        case 'triangle':
          drawTriangle(ctx, x, y, blob.size, blob.rotation);
          break;
      }
    });
    
    // Reset filter and blend mode before applying grain
    ctx.filter = 'none';
    ctx.globalCompositeOperation = 'source-over';
    
    // Step 4: Apply grain effect
    if (grain > 0) {
      // Generate grain at the actual canvas pixel dimensions (accounting for DPR)
      const grainData = generateGrainPattern(canvas.width, canvas.height, grain);
      
      // Create an offscreen canvas to hold the grain
      const grainCanvas = document.createElement('canvas');
      grainCanvas.width = canvas.width;
      grainCanvas.height = canvas.height;
      const grainCtx = grainCanvas.getContext('2d');
      
      if (grainCtx) {
        grainCtx.putImageData(grainData, 0, 0);
        
        // Now draw the grain canvas onto the main canvas with blending
        // Temporarily reset scale to draw at actual pixel dimensions
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        
        // Use overlay blend mode for more natural grain effect
        ctx.globalCompositeOperation = 'overlay';
        ctx.globalAlpha = grain > 1 ? grain / 20 : grain * 0.5; // Reduce opacity for subtlety
        ctx.drawImage(grainCanvas, 0, 0);
        
        // Reset
        ctx.globalAlpha = 1;
        ctx.globalCompositeOperation = 'source-over';
        
        // Restore the scale
        ctx.scale(dpr, dpr);
      }
    }
    
  }, [width, height, backgroundColor, blendMode, blur, grain, blobs]);
  
  return (
    <canvas
      ref={canvasRef}
      style={{
        display: 'block',
        maxWidth: '100%',
        height: 'auto',
      }}
    />
  );
};

export default StaticGradientCanvas;
