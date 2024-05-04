import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Meta, Story } from '@storybook/angular';
import { action } from '@storybook/addon-actions';
import { VerticalHideFrame, VerticalHideModule } from '.';

export default {
  title: 'Frames/VerticalHide',
  component: VerticalHideFrame,
} as Meta;

const ACTIONS = {
  // eventEmitterName: action('eventEmitterName'),
};


const Template: Story = (args) => ({
  props: {...args, ...ACTIONS},
  moduleMetadata: {
    imports: [
      VerticalHideModule,
    ]
  }
});

export const Default = Template.bind({});
Default.args = {};
