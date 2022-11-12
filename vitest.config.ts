import { mergeConfig } from "vite";
import { defineConfig } from "vitest/config";
import viteConfig from "./vite.config";

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      coverage: {
        reporter: ["text", "html"],
      },
      css: {
        modules: {
          classNameStrategy: "non-scoped",
        },
      },
      environment: "jsdom",
      globals: true,
      setupFiles: "./src/test/setup.ts",
    },
  })
);
