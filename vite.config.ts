import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  const env = loadEnv(mode, process.cwd(), '');

  // Priority: 
  // 1. System Environment Variable (Vercel/Cloud) -> process.env.API_KEY
  // 2. .env file loaded by Vite -> env.API_KEY
  const apiKey = process.env.API_KEY || env.API_KEY;

  return {
    plugins: [react()],
    define: {
      // Polyfill process.env.API_KEY so the existing service code works without modification
      // This injects the actual value string into the client-side code during build
      'process.env.API_KEY': JSON.stringify(apiKey),
    },
  };
});