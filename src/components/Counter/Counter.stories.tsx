import { ComponentMeta, ComponentStory } from "@storybook/react";
import Counter from "./Counter";

export default {
  title: "Counter",
  component: Counter,
} as ComponentMeta<typeof Counter>;

export const Template: ComponentStory<typeof Counter> = (args) => (
  <Counter {...args} />
);

export const Default = Template.bind({});

Default.args = {
  initialValue: 0,
};
