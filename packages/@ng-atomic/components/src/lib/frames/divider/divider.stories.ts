import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Meta, Story } from '@storybook/angular';
import { action } from '@storybook/addon-actions';
import { DividerFrame, DividerModule } from '.';

export default {
  title: 'Frames/Divider',
  component: DividerFrame,
} as Meta;

const ACTIONS = {
  // eventEmitterName: action('eventEmitterName'),
};


const Template: Story = (args) => ({
  props: {...args, ...ACTIONS},
  moduleMetadata: {
    imports: [
      DividerModule,
    ]
  }
});

export const Default = Template.bind({});
Default.args = {};
