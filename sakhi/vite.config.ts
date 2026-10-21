import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { viteSingleFile } from 'vite-plugin-singlefile';

// Builds ONE self-contained file: public/index.html (JS + CSS + sample data inlined).
export default defineConfig({
  plugins: [react(), tailwindcss(), viteSingleFile()],
  publicDir: false,
  build: { outDir: 'public', emptyOutDir: true },
  server: { proxy: { '/api': 'http://localhost:3001' } },
});
