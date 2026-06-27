import path from "node:path";

import tailwindcss from "@tailwindcss/vite";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

// The backend enforces a strict CORS allowlist (ALLOWED_ORIGINS) with
// credentials:true for the refresh-token cookie. Proxying here keeps dev
// requests same-origin so the cookie round-trips without touching that
// allowlist. See plan: streamed-spinning-grove.md.
const API_PROXY_TARGET =
  "https://maintenanceandinventorymanagementserver-production.up.railway.app";

export default defineConfig({
  plugins: [tanstackRouter({ target: "react", autoCodeSplitting: true }), react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    proxy: {
      "/api": {
        target: API_PROXY_TARGET,
        changeOrigin: true,
      },
    },
  },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./src/test/setup.ts"],
    css: true,
  },
});
