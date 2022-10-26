import { ComponentMeta, ComponentStory } from "@storybook/react";
import FlightBooker from "./FlightBooker";

export default {
  title: "Flight booker",
  component: FlightBooker,
} as ComponentMeta<typeof FlightBooker>;

export const Template: ComponentStory<typeof FlightBooker> = () => (
  <FlightBooker />
);

export const Default = Template.bind({});
