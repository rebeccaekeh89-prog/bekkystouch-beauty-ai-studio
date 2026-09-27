import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'fs';
import {defineConfig, Plugin} from 'vite';

function imageUploadPlugin(): Plugin {
  return {
    name: 'image-upload-handler',
    configureServer(server) {
      server.middlewares.use('/api/upload-image', (req, res) => {
        if (req.method === 'POST') {
          let body = '';
          req.on('data', chunk => {
            body += chunk;
          });
          req.on('end', () => {
            try {
              const { filename, base64Data } = JSON.parse(body);
              if (!filename || !base64Data) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Missing filename or base64Data' }));
                return;
              }
              const cleanBase64 = base64Data.replace(/^data:image\/\w+;base64,/, '');
              const buffer = Buffer.from(cleanBase64, 'base64');

              let targetPath: string;
              let distPath: string | null = null;

              if (filename === 'philosophy.jpg' || filename === 'hero.jpg') {
                targetPath = path.resolve(__dirname, 'public', filename);
                const distDir = path.resolve(__dirname, 'dist');
                if (fs.existsSync(distDir)) {
                  distPath = path.join(distDir, filename);
                }
              } else {
                const targetDir = path.resolve(__dirname, 'public/products');
                if (!fs.existsSync(targetDir)) {
                  fs.mkdirSync(targetDir, { recursive: true });
                }
                targetPath = path.join(targetDir, filename);
                const distDir = path.resolve(__dirname, 'dist/products');
                if (fs.existsSync(distDir)) {
                  distPath = path.join(distDir, filename);
                }
              }

              fs.writeFileSync(targetPath, buffer);
              if (distPath) {
                fs.writeFileSync(distPath, buffer);
              }

              const publicUrl = (filename === 'philosophy.jpg' || filename === 'hero.jpg')
                ? `/${filename}?t=${Date.now()}`
                : `/products/${filename}?t=${Date.now()}`;

              res.writeHead(200, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ success: true, path: publicUrl }));
            } catch (err: any) {
              res.writeHead(500, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ error: err.message }));
            }
          });
        } else {
          res.writeHead(405);
          res.end();
        }
      });
    },
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), imageUploadPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
