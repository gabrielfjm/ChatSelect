import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import { resolve } from "node:path";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./vitest.setup.ts"],
    include: ["tests/**/*.test.{ts,tsx}"],
  },
  resolve: {
    alias: {
      "server-only": resolve(
        import.meta.dirname,
        "./tests/stubs/server-only.ts",
      ),
      "@": resolve(import.meta.dirname, "./src"),
    },
  },
});
