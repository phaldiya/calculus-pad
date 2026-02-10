import { cpSync } from 'node:fs';
import { resolve } from 'node:path';

import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react-swc';
import { defineConfig, type Plugin } from 'vite';

function copyExtensionFiles(): Plugin {
  return {
    name: 'copy-extension-files',
    closeBundle() {
      const out = resolve(__dirname, 'dist-extension');
      cpSync(resolve(__dirname, 'extension/manifest.json'), resolve(out, 'manifest.json'));
      cpSync(resolve(__dirname, 'extension/service-worker.js'), resolve(out, 'service-worker.js'));
      cpSync(resolve(__dirname, 'extension/icons'), resolve(out, 'icons'), { recursive: true });
      console.log('Copied extension files to dist-extension/');
    },
  };
}

export default defineConfig({
  base: './',
  plugins: [react(), tailwindcss(), copyExtensionFiles()],
  build: {
    outDir: 'dist-extension',
  },
});
