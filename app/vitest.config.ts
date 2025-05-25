import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "jsdom",
    alias: {
      "@": "/workspaces/cadet/app",
    },
    coverage: {
      reporter: ["text", "json", "html"],
    },
  },
});
