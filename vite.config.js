import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react({
    // React 17+ の新しいJSX Transformを使用
    jsxRuntime: 'classic',
  })],
  server: {
    port: 3000,
    open: true,
    fs: {
      strict: true,
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
    extensions: ['.js', '.jsx', '.json'],
  },
  esbuild: {
    // JSX構文を有効化
    jsxInject: `import React from 'react'`,
  },
  base: './',
});
