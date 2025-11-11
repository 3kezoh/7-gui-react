import type { Meta, StoryObj } from "@storybook/react-vite";
import TemperatureConverter from "./TemperatureConverter";

const meta = {
	component: TemperatureConverter,
} satisfies Meta<typeof TemperatureConverter>;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {};

export default meta;
