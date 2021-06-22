import { defineConfig } from 'vite';
import legacy from '@vitejs/plugin-legacy';

const ViteConfig = defineConfig({
   plugins: [
      legacy({
         targets: ['defaults', 'IE 11'],
         polyfills: true,
      }),
   ],
   build: {
      target: 'es6',
      assetsDir: 'static',
      polyfillDynamicImport: true,
   },
});

export default ViteConfig;
