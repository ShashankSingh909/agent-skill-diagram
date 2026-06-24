import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base:
    process.env.GITHUB_PAGES === "true"
      ? "/agent-skill-diagram/"
      : "/",
  optimizeDeps: {
    include: ["react", "react-dom/client"],
  },
  server: {
    warmup: {
      clientFiles: ["./src/main.jsx"],
    },
  },
  plugins: [react()],
  test: {
    environment: "jsdom",
    setupFiles: ["./src/test-setup.js"],
  },
});
