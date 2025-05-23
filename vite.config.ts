/// <reference types="vitest" />
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://medium.com/@vitor.vicen.te/setting-up-path-aliases-in-a-vite-typescript-react-project-the-ultimate-way-d2a9a8ff7c63
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  css: {
    modules: {
      localsConvention: "camelCaseOnly",
    },
  },
  assetsInclude: ["**/*.ant"],

  test: {
    setupFiles: ["./src/vitest-setup.ts"],
    environment: "jsdom",
    coverage: {
      include: ["src"],
      exclude: [
        "**/__mocks__/**",
        "src/icons/",
        "src/assets",
        "src/testing-utils",
        "src/third-party/",
      ],
    },
  },
});
