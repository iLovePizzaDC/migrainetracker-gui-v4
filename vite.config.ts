/// <reference types="vitest" />
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vitest/config';
import { sentryVitePlugin } from "@sentry/vite-plugin";

// https://vite.dev/config/
export default defineConfig(({ command }) => ({
  build: {
    sourcemap: "hidden",
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
  },
  plugins: [
    react({
      babel: {
        plugins: [['babel-plugin-react-compiler']],
      },
    }),
    command === 'build' && sentryVitePlugin({
      org: "unrealpizza",
      project: "migrainetracker-gui-v4",
      authToken: process.env.SENTRY_AUTH_TOKEN,
      release: { name: process.env.SENTRY_RELEASE },
      sourcemaps: { filesToDeleteAfterUpload: ["./dist/**/*.map"] },
    }),
  ].filter(Boolean),
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
}));
