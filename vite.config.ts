import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { shellWorkerPlugin } from './scripts/pwa/vite-plugin'

export default defineConfig({ plugins: [react(), shellWorkerPlugin()] })
