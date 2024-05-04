import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Meta, Story } from '@storybook/angular';
import { action } from '@storybook/addon-actions';
import { LoadingFrame, LoadingModule } from '.';

export default {
  title: 'Frames/Loading',
  component: LoadingFrame,
} as Meta;

const ACTIONS = {
  // eventEmitterName: action('eventEmitterName'),
};


const Template: Story = (args) => ({
  props: {...args, ...ACTIONS},
  moduleMetadata: {
    imports: [
      LoadingModule,
    ]
  }
});

export const Default = Template.bind({});
Default.args = {};
