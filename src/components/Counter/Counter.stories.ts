import { Meta, StoryObj } from "@storybook/react";
import Counter from "./Counter";

const meta = {
  component: Counter,
} satisfies Meta<typeof Counter>;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {},
};

export default meta;
