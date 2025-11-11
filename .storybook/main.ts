import type { StorybookConfig } from "@storybook/react-vite";

const config: StorybookConfig = {
	stories: ["../src/**/*.stories.mdx", "../src/**/*.stories.@(js|jsx|ts|tsx)"],
	addons: ["@storybook/addon-docs"],

	framework: {
		name: "@storybook/react-vite",
		options: {},
	},

	core: {
		disableTelemetry: true,
	},

	features: {
		storyStoreV7: true,
	},
};

export default config;
