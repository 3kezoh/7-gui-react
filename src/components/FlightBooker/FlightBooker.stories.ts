import { Meta, StoryObj } from "@storybook/react";
import FlightBooker from "./FlightBooker";

const meta = {
  component: FlightBooker,
} satisfies Meta<typeof FlightBooker>;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {};

export default meta;
