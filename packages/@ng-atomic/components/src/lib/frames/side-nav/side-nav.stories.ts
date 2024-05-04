import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Meta, Story } from '@storybook/angular';
import { action } from '@storybook/addon-actions';
import { SideNavFrame, SideNavModule } from '.';

export default {
  title: 'Frames/SideNav',
  component: SideNavFrame,
} as Meta;

const ACTIONS = {
  // eventEmitterName: action('eventEmitterName'),
};


const Template: Story = (args) => ({
  props: {...args, ...ACTIONS},
  moduleMetadata: {
    imports: [
      SideNavModule,
    ]
  }
});

export const Default = Template.bind({});
Default.args = {};
