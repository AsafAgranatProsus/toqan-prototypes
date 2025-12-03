import path from 'path';
import fs from 'fs';
import { defineConfig, loadEnv, Plugin } from 'vite';
import react from '@vitejs/plugin-react';

/**
 * Dev-only plugin for saving themes to the library
 * This allows the Theme Builder to save files directly during development
 */
function themeSavePlugin(): Plugin {
  return {
    name: 'theme-save-plugin',
    configureServer(server) {
      // POST /api/save-theme - saves theme CSS and updates manifest
      server.middlewares.use('/api/save-theme', async (req, res) => {
        if (req.method !== 'POST') {
          res.statusCode = 405;
          res.end(JSON.stringify({ error: 'Method not allowed' }));
          return;
        }

        let body = '';
        req.on('data', chunk => { body += chunk; });
        req.on('end', async () => {
          try {
            const { css, manifest } = JSON.parse(body);
            const themesDir = path.resolve(__dirname, 'public/themes');
            const manifestPath = path.join(themesDir, 'themes.json');
            
            // Ensure themes directory exists
            if (!fs.existsSync(themesDir)) {
              fs.mkdirSync(themesDir, { recursive: true });
            }
            
            // Save CSS file
            const cssPath = path.join(themesDir, manifest.filename);
            fs.writeFileSync(cssPath, css, 'utf-8');
            console.log(`[ThemeSave] Saved CSS: ${manifest.filename}`);
            
            // Update manifest
            let existingManifest = { themes: [] };
            if (fs.existsSync(manifestPath)) {
              existingManifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));
            }
            
            // Check if theme already exists (by id)
            const existingIndex = existingManifest.themes.findIndex(
              (t: any) => t.id === manifest.id
            );
            
            if (existingIndex >= 0) {
              // Update existing theme
              existingManifest.themes[existingIndex] = manifest;
              console.log(`[ThemeSave] Updated manifest entry: ${manifest.id}`);
            } else {
              // Add new theme
              existingManifest.themes.push(manifest);
              console.log(`[ThemeSave] Added manifest entry: ${manifest.id}`);
            }
            
            fs.writeFileSync(manifestPath, JSON.stringify(existingManifest, null, 2), 'utf-8');
            
            res.setHeader('Content-Type', 'application/json');
            res.statusCode = 200;
            res.end(JSON.stringify({ success: true, filename: manifest.filename }));
          } catch (error) {
            console.error('[ThemeSave] Error:', error);
            res.statusCode = 500;
            res.end(JSON.stringify({ error: String(error) }));
          }
        });
      });
    },
  };
}

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [
        react(),
        themeSavePlugin(), // Dev-only theme saving
      ],
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      },
      // Serve static theme files from public folder
      publicDir: 'public',
    };
});
