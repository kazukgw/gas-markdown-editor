import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    host: "0.0.0.0",
    port: 8080,
  },

  build: {
    rollupOptions: {
      output: {
        manualChunks: undefined,
      },
    },
  },

  plugins: [svelte()],
});
