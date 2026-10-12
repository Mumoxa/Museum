import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Dev/preview servers are reached through the sandbox preview proxy, so they
// must bind to all interfaces and accept the preview host header.
export default defineConfig(({ command }) => ({
  // GitHub Pages serves the project site at /Museum/ in production builds only.
  base: command === 'build' ? '/Museum/' : '/',
  plugins: [react()],
  server: { host: '0.0.0.0', port: 5173, allowedHosts: true },
  preview: { host: '0.0.0.0', port: 4173, allowedHosts: true },
  build: { target: 'es2020', chunkSizeWarningLimit: 900 },
}));
