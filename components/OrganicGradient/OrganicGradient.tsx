import React, { useEffect, useRef } from 'react';

export type NoiseAlgorithm = 'value' | 'simplex' | 'perlin' | 'fbm';

export interface ColorStop {
  color: string;
  alpha: number;
  threshold: number; // 0-1, when this color appears
}

interface OrganicGradientProps {
  seed?: number;
  blurIntensity?: number;
  noiseScale?: number;
  grainIntensity?: number;
  iterations?: number;
  colors?: ColorStop[];
  noiseAlgorithm?: NoiseAlgorithm;
}

// Helper to convert hex color to RGBA vec4
const hexToRgba = (hex: string, alpha: number): [number, number, number, number] => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? [
        parseInt(result[1], 16) / 255,
        parseInt(result[2], 16) / 255,
        parseInt(result[3], 16) / 255,
        alpha,
      ]
    : [0, 0, 0, alpha];
};

const DEFAULT_COLORS: ColorStop[] = [
  { color: '#000000', alpha: 1.0, threshold: 0.0 },
  { color: '#191a66', alpha: 1.0, threshold: 0.3 },
  { color: '#19ccc1', alpha: 0.8, threshold: 0.6 },
  { color: '#cc1980', alpha: 0.8, threshold: 0.85 },
];

const OrganicGradient: React.FC<OrganicGradientProps> = ({ 
  seed = 0,
  blurIntensity = 1.0,
  noiseScale = 2.0,
  grainIntensity = 0.15,
  iterations = 30,
  colors = DEFAULT_COLORS,
  noiseAlgorithm = 'value',
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const gl = canvas.getContext('webgl');
    if (!gl) {
      console.error('WebGL not supported');
      return;
    }

    // --- 1. Vertex Shader (Same as before) ---
    const vsSource = `
      attribute vec4 a_position;
      void main() {
        gl_Position = a_position;
      }
    `;

    // --- 2. Fragment Shader with multiple noise algorithms ---
    const fsSource = `
      precision highp float;
      uniform vec2 u_resolution;
      uniform float u_seed;
      uniform float u_blurIntensity;
      uniform float u_noiseScale;
      uniform float u_grainIntensity;
      uniform float u_iterations;
      uniform int u_noiseType; // 0=value, 1=simplex, 2=perlin, 3=fbm
      uniform int u_colorCount;
      
      // Colors and thresholds (max 8 colors)
      uniform vec4 u_colors[8];
      uniform float u_thresholds[8];

      #define PI 3.14159265359

      // --- VALUE NOISE ---
      float random(vec2 st) {
        return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
      }

      float valueNoise(vec2 st) {
        vec2 i = floor(st);
        vec2 f = fract(st);
        float a = random(i);
        float b = random(i + vec2(1.0, 0.0));
        float c = random(i + vec2(0.0, 1.0));
        float d = random(i + vec2(1.0, 1.0));
        vec2 u = f * f * (3.0 - 2.0 * f);
        return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
      }

      // --- SIMPLEX NOISE ---
      vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
      vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
      vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }

      float simplexNoise(vec2 v) {
        const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
        vec2 i = floor(v + dot(v, C.yy));
        vec2 x0 = v - i + dot(i, C.xx);
        vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
        vec4 x12 = x0.xyxy + C.xxzz;
        x12.xy -= i1;
        i = mod289(i);
        vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
        vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
        m = m*m;
        m = m*m;
        vec3 x = 2.0 * fract(p * C.www) - 1.0;
        vec3 h = abs(x) - 0.5;
        vec3 ox = floor(x + 0.5);
        vec3 a0 = x - ox;
        m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);
        vec3 g;
        g.x = a0.x * x0.x + h.x * x0.y;
        g.yz = a0.yz * x12.xz + h.yz * x12.yw;
        return 130.0 * dot(m, g);
      }

      // --- PERLIN NOISE ---
      vec2 fade(vec2 t) { return t*t*t*(t*(t*6.0-15.0)+10.0); }
      
      float perlinNoise(vec2 P) {
        vec2 Pi = floor(P);
        vec2 Pf = fract(P);
        vec2 w = fade(Pf);
        
        float a = random(Pi);
        float b = random(Pi + vec2(1.0, 0.0));
        float c = random(Pi + vec2(0.0, 1.0));
        float d = random(Pi + vec2(1.0, 1.0));
        
        return mix(mix(a, b, w.x), mix(c, d, w.x), w.y);
      }

      // --- FBM (Fractal Brownian Motion) ---
      float fbmNoise(vec2 st) {
        float value = 0.0;
        float amplitude = 0.5;
        for(int i = 0; i < 4; i++) {
          value += amplitude * valueNoise(st);
          st *= 2.0;
          amplitude *= 0.5;
        }
        return value;
      }

      // --- UNIFIED NOISE FUNCTION ---
      float getNoise(vec2 st) {
        if (u_noiseType == 0) return valueNoise(st);
        if (u_noiseType == 1) return simplexNoise(st) * 0.5 + 0.5;
        if (u_noiseType == 2) return perlinNoise(st);
        if (u_noiseType == 3) return fbmNoise(st);
        return valueNoise(st);
      }

      // --- SCENE WITH DYNAMIC COLORS ---
      vec4 getSceneColor(vec2 uv) {
        float t = u_seed;
        vec2 pos = uv * u_noiseScale;
        
        float n1 = getNoise(pos + vec2(t, t * 0.5));
        float n2 = getNoise(pos + vec2(n1, n1) + vec2(t * -0.2, t * 0.4));
        float n3 = getNoise(pos * 0.5 + vec2(t * 0.3));
        
        // Combine noises
        float noiseValue = (n1 * 0.5 + n2 * 0.3 + n3 * 0.2);
        
        // Mix colors based on thresholds
        vec4 finalColor = u_colors[0];
        
        for(int i = 1; i < 8; i++) {
          if (i >= u_colorCount) break;
          float t = smoothstep(u_thresholds[i] - 0.1, u_thresholds[i] + 0.1, noiseValue);
          finalColor = mix(finalColor, u_colors[i], t * u_colors[i].a);
        }
        
        return finalColor;
      }

      // --- MAIN ---
      void main() {
        vec2 uv = gl_FragCoord.xy / u_resolution.xy;
        vec2 aspect = vec2(u_resolution.x / u_resolution.y, 1.0);

        // Focus Mask
        float focusNoise = getNoise(uv * 1.5 + u_seed * 0.1);
        float focusVal = smoothstep(0.4, 0.6, focusNoise); 
        float blurRadius = (1.0 - focusVal) * 0.05 * u_blurIntensity;

        // Bokeh Loop
        vec4 accColor = vec4(0.0);
        float totalWeight = 0.0;
        float goldenAngle = 2.39996323;

        for (float i = 0.0; i < 100.0; i++) {
          if (i >= u_iterations) break;
          float theta = i * goldenAngle;
          float r = sqrt(i) / sqrt(u_iterations);
          vec2 offset = vec2(cos(theta), sin(theta)) * r * blurRadius;
          offset.x /= aspect.x;
          vec4 col = getSceneColor(uv + offset);
          accColor += col * col.a; // Pre-multiply alpha
          totalWeight += col.a;
        }

        vec4 finalColor = accColor / max(totalWeight, 0.001);

        // Static grain (frozen noise)
        float grain = (random(uv + u_seed) - 0.5) * u_grainIntensity;
        finalColor.rgb += grain;
        finalColor.a = 1.0; // Final output is opaque

        gl_FragColor = finalColor;
      }
    `;

    // --- Boilerplate ---
    const compileShader = (src: string, type: number) => {
      const shader = gl.createShader(type);
      if (!shader) return null;
      
      gl.shaderSource(shader, src);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error(gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    };

    const vertexShader = compileShader(vsSource, gl.VERTEX_SHADER);
    const fragmentShader = compileShader(fsSource, gl.FRAGMENT_SHADER);
    
    if (!vertexShader || !fragmentShader) return;

    const program = gl.createProgram();
    if (!program) return;
    
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error('Program link failed:', gl.getProgramInfoLog(program));
      return;
    }
    
    gl.useProgram(program);

    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);

    const posLoc = gl.getAttribLocation(program, 'a_position');
    gl.enableVertexAttribArray(posLoc);
    gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

    const uResLoc = gl.getUniformLocation(program, 'u_resolution');
    const uSeedLoc = gl.getUniformLocation(program, 'u_seed');
    const uBlurIntensityLoc = gl.getUniformLocation(program, 'u_blurIntensity');
    const uNoiseScaleLoc = gl.getUniformLocation(program, 'u_noiseScale');
    const uGrainIntensityLoc = gl.getUniformLocation(program, 'u_grainIntensity');
    const uIterationsLoc = gl.getUniformLocation(program, 'u_iterations');
    const uNoiseTypeLoc = gl.getUniformLocation(program, 'u_noiseType');
    const uColorCountLoc = gl.getUniformLocation(program, 'u_colorCount');

    // --- THE ONE-SHOT RENDER ---
    const draw = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      
      // 1. Set size to container
      canvas.width = parent.clientWidth;
      canvas.height = parent.clientHeight;
      gl.viewport(0, 0, canvas.width, canvas.height);

      // 2. Pass uniforms
      gl.uniform2f(uResLoc, canvas.width, canvas.height);
      gl.uniform1f(uSeedLoc, seed + 10.0);
      gl.uniform1f(uBlurIntensityLoc, blurIntensity);
      gl.uniform1f(uNoiseScaleLoc, noiseScale);
      gl.uniform1f(uGrainIntensityLoc, grainIntensity);
      gl.uniform1f(uIterationsLoc, iterations);
      
      // Noise algorithm
      const noiseTypeMap: Record<NoiseAlgorithm, number> = {
        'value': 0,
        'simplex': 1,
        'perlin': 2,
        'fbm': 3,
      };
      gl.uniform1i(uNoiseTypeLoc, noiseTypeMap[noiseAlgorithm]);
      
      // Pass colors dynamically
      const colorCount = Math.min(colors.length, 8);
      gl.uniform1i(uColorCountLoc, colorCount);
      
      for (let i = 0; i < 8; i++) {
        const colorLoc = gl.getUniformLocation(program, `u_colors[${i}]`);
        const thresholdLoc = gl.getUniformLocation(program, `u_thresholds[${i}]`);
        
        if (i < colorCount) {
          const rgba = hexToRgba(colors[i].color, colors[i].alpha);
          gl.uniform4f(colorLoc, rgba[0], rgba[1], rgba[2], rgba[3]);
          gl.uniform1f(thresholdLoc, colors[i].threshold);
        } else {
          gl.uniform4f(colorLoc, 0, 0, 0, 0);
          gl.uniform1f(thresholdLoc, 0);
        }
      }

      // 3. Draw ONCE
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      
      // 4. Do NOT call requestAnimationFrame
    };

    // Draw initially
    draw();

    // Use ResizeObserver for better container-based resizing
    const resizeObserver = new ResizeObserver(() => {
      draw();
    });
    
    if (canvas.parentElement) {
      resizeObserver.observe(canvas.parentElement);
    }

    return () => {
      resizeObserver.disconnect();
      gl.deleteProgram(program);
    };
  }, [seed, blurIntensity, noiseScale, grainIntensity, iterations, colors, noiseAlgorithm]);

  return (
    <canvas 
      ref={canvasRef} 
      style={{ 
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        display: 'block',
      }} 
    />
  );
};

export default OrganicGradient;
