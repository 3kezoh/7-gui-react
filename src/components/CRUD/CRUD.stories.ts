import { Meta, StoryObj } from "@storybook/react";
import CRUD from "./CRUD";

const meta = {
  component: CRUD,
} satisfies Meta<typeof CRUD>;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {};

export default meta;
