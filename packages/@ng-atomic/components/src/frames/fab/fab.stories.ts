import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Meta, Story } from '@storybook/angular';
import { action } from '@storybook/addon-actions';
import { FabFrame, FabModule } from '.';

export default {
  title: 'Frames/Fab',
  component: FabFrame,
} as Meta;

const ACTIONS = {
  // eventEmitterName: action('eventEmitterName'),
};


const Template: Story = (args) => ({
  props: {...args, ...ACTIONS},
  moduleMetadata: {
    imports: [
      FabModule,
    ]
  }
});

export const Default = Template.bind({});
Default.args = {};
