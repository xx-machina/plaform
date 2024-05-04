import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Meta, Story } from '@storybook/angular';
import { action } from '@storybook/addon-actions';
import { RouterOutletFrame, RouterOutletModule } from '.';

export default {
  title: 'Frames/RouterOutlet',
  component: RouterOutletFrame,
} as Meta;

const ACTIONS = {
  // eventEmitterName: action('eventEmitterName'),
};


const Template: Story = (args) => ({
  props: {...args, ...ACTIONS},
  moduleMetadata: {
    imports: [
      RouterOutletModule,
    ]
  }
});

export const Default = Template.bind({});
Default.args = {};
