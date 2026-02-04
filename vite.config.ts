/// <reference types="vitest/config" />

import path from "node:path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { playwright } from "@vitest/browser-playwright";
import type { UserConfig } from "vite";

export default {
	plugins: [react(), tailwindcss()],
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "src"),
		},
	},
	server: {
		port: 3000,
	},
	test: {
		browser: {
			enabled: true,
			headless: true,
			// https://vitest.dev/config/browser/playwright
			instances: [
				{ browser: "chromium" },
				{ browser: "firefox" },
				{ browser: "webkit" },
			],
			provider: playwright(),
		},
		coverage: {
			provider: "v8",
			reporter: ["text", "html"],
		},
		css: {
			modules: {
				classNameStrategy: "non-scoped",
			},
		},
		globals: true,
		setupFiles: ["tests/setup.ts"],
	},
} satisfies UserConfig;
