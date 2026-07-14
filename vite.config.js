import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    // honor the harness-assigned port (autoPort) when present
    port: Number(process.env.PORT) || 5173,
  },
});
