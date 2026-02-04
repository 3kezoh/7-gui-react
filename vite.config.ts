/// <reference types="vitest/config" />

import path from "node:path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { playwright } from "@vitest/browser-playwright";
import type { UserConfig } from "vite";

export default {
	plugins: [react(), tailwindcss()],
	server: {
		port: 3000,
	},
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "src"),
		},
	},
	test: {
		browser: {
			enabled: true,
			provider: playwright(),
			headless: true,
			// https://vitest.dev/config/browser/playwright
			instances: [
				{ browser: "chromium" },
				{ browser: "firefox" },
				{ browser: "webkit" },
			],
		},
		css: {
			modules: {
				classNameStrategy: "non-scoped",
			},
		},
		coverage: {
			reporter: ["text", "html"],
			provider: "v8",
		},
		setupFiles: ["tests/setup.ts"],
		globals: true,
	},
} satisfies UserConfig;
