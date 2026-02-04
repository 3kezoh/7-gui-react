import type { StorybookConfig } from "@storybook/react-vite";

const config: StorybookConfig = {
	addons: ["@storybook/addon-docs"],

	core: {
		disableTelemetry: true,
	},

	features: {
		storyStoreV7: true,
	},

	framework: {
		name: "@storybook/react-vite",
		options: {},
	},
	stories: ["../src/**/*.stories.mdx", "../src/**/*.stories.@(js|jsx|ts|tsx)"],
};

export default config;
