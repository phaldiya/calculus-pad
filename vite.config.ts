import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react-swc';
import { defineConfig } from 'vite';

export default defineConfig({
  base: '/calculus-lab/',
  plugins: [react(), tailwindcss()],
  server: {
    port: 5000,
    strictPort: true,
  },
});
