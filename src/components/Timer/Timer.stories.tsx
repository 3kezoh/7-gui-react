import { Meta, StoryObj } from "@storybook/react";
import Timer from "./Timer";

const meta = {
  component: Timer,
} satisfies Meta<typeof Timer>;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {};

export default meta;
