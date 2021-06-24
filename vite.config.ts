import { defineConfig } from 'vite';
import legacy from '@vitejs/plugin-legacy';

const ViteConfig = defineConfig({
   server: {
      port: 4000,
      open: true,
      cors: false,
      strictPort: true,
   },
   plugins: [
      legacy({
         targets: ['defaults', 'IE 11'],
         polyfills: true,
         modernPolyfills: true,
         renderLegacyChunks: true,
      }),
   ],
   build: {
      target: 'es6',
      assetsDir: 'static',
      polyfillDynamicImport: true,
      brotliSize: true,
      chunkSizeWarningLimit: 400,
      sourcemap: true,
      write: true,
   },
});

export default ViteConfig;
