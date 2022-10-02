import { ComponentMeta, ComponentStory } from "@storybook/react";
import TemperatureConverter from "./TemperatureConverter";

export default {
  title: "Temperature converter",
  component: TemperatureConverter,
} as ComponentMeta<typeof TemperatureConverter>;

export const Template: ComponentStory<typeof TemperatureConverter> = (args) => (
  <TemperatureConverter {...args} />
);

export const Default = Template.bind({});
