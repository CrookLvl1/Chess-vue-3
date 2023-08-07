import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

import {pagePort, localIp } from './src/web-socket-server/base';

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: pagePort,
    host: localIp
  },
  plugins: [
    vue(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
