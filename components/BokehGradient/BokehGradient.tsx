import React, { useEffect, useRef } from 'react';

const BokehGradient = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const gl = canvas.getContext('webgl');

    if (!gl) {
      console.error('WebGL not supported');
      return;
    }

    // 1. Vertex Shader (Standard fullscreen quad)
    const vsSource = `
      attribute vec4 a_position;
      void main() {
        gl_Position = a_position;
      }
    `;

    // 2. Fragment Shader (The Magic)
    const fsSource = `
      precision highp float;
      uniform vec2 u_resolution;
      uniform float u_time;

      #define PI 3.14159265359
      #define ITERATIONS 30.0 // Higher = smoother but slower

      // --- SCENE GENERATION (Replacing an image texture) ---
      // This function draws a grid of circles to demonstrate the blur
      vec3 getSceneColor(vec2 uv) {
        // Create a grid coordinate system
        vec2 grid = fract(uv * 10.0) - 0.5;
        
        // Draw a circle in each grid cell
        float dist = length(grid);
        float circle = smoothstep(0.3, 0.28, dist);
        
        // Colorful aesthetics
        vec3 col = 0.5 + 0.5 * cos(u_time + uv.xyx + vec3(0, 2, 4));
        return vec3(circle) * col;
      }

      // --- GOLDEN ANGLE BOKEH BLUR ---
      void main() {
        vec2 uv = gl_FragCoord.xy / u_resolution.xy;
        
        // Correct aspect ratio
        vec2 aspect = vec2(u_resolution.x / u_resolution.y, 1.0);

        // 1. CREATE THE MASK
        // Here we define where the blur happens.
        // Currently: Sharp at top (y=1.0), Blurry at bottom (y=0.0)
        // You can use noise here for "patchy" blur!
        float blurMask = 1.0 - uv.y; 
        
        // Make the transition non-linear (exponential) for dramatic effect
        blurMask = pow(blurMask, 3.0); 

        // Max blur radius
        float radius = 0.04 * blurMask; 

        // 2. APPLY THE BLUR LOOP
        vec3 accumColor = vec3(0.0);
        float totalWeight = 0.0;
        
        // Golden Angle (approx 2.399 radians) prevents sampling artifacts
        float goldenAngle = 2.39996323; 

        for (float i = 0.0; i < ITERATIONS; i++) {
          // Calculate sampling offset based on spiral
          float theta = i * goldenAngle;
          float r = sqrt(i) / sqrt(ITERATIONS);
          
          // Apply radius based on our Mask
          vec2 offset = vec2(cos(theta), sin(theta)) * r * radius;
          
          // Adjust offset for aspect ratio so blur isn't squashed
          offset.x /= aspect.x;

          // Sample the "Scene" at the offset position
          vec3 col = getSceneColor(uv + offset);
          
          // Accumulate
          accumColor += col;
          totalWeight += 1.0;
        }

        vec3 finalColor = accumColor / totalWeight;

        gl_FragColor = vec4(finalColor, 1.0);
      }
    `;

    // --- WebGL Boilerplate Setup ---
    const createShader = (type: number, source: string) => {
      const shader = gl.createShader(type);
      if (!shader) return null;
      
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error(gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    };

    const vertexShader = createShader(gl.VERTEX_SHADER, vsSource);
    const fragmentShader = createShader(gl.FRAGMENT_SHADER, fsSource);
    
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
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
      -1, -1, 3, -1, -1, 3
    ]), gl.STATIC_DRAW);

    const positionLoc = gl.getAttribLocation(program, 'a_position');
    gl.enableVertexAttribArray(positionLoc);
    gl.vertexAttribPointer(positionLoc, 2, gl.FLOAT, false, 0, 0);

    const uResolution = gl.getUniformLocation(program, 'u_resolution');
    const uTime = gl.getUniformLocation(program, 'u_time');

    // Resize Handler
    const resizeCanvas = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      
      canvas.width = parent.clientWidth;
      canvas.height = parent.clientHeight;
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform2f(uResolution, canvas.width, canvas.height);
    };

    // Use ResizeObserver for better container-based resizing
    const resizeObserver = new ResizeObserver(() => {
      resizeCanvas();
    });
    
    if (canvas.parentElement) {
      resizeObserver.observe(canvas.parentElement);
    }
    
    resizeCanvas(); // Initial sizing

    // Animation Loop
    let animationFrameId: number;
    const startTime = performance.now();

    const render = () => {
      const currentTime = (performance.now() - startTime) * 0.001; // Seconds
      gl.uniform1f(uTime, currentTime);
      
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    // Cleanup
    return () => {
      resizeObserver.disconnect();
      cancelAnimationFrame(animationFrameId);
      gl.deleteProgram(program);
    };
  }, []);

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

export default BokehGradient;
