import { tanstackRouter } from "@tanstack/router-plugin/vite";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";

// In development the API is proxied so cookies are same-origin and no CORS is needed.
const apiTarget = process.env["VITE_DEV_API_TARGET"] ?? "http://localhost:3000";

export default defineConfig({
  plugins: [tanstackRouter({ target: "react", autoCodeSplitting: true }), react(), tailwindcss()],
  resolve: { alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) } },
  server: { port: 5173, proxy: { "/api": { target: apiTarget, changeOrigin: false } } },
  build: { sourcemap: true, target: "es2022" },
});
