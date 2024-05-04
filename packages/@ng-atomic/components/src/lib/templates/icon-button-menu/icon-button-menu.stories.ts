import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Meta, Story } from '@storybook/angular';
import { action } from '@storybook/addon-actions';
import { IconButtonMenuTemplate, IconButtonMenuModule } from '.';

export default {
  title: 'Templates/IconButtonMenu',
  component: IconButtonMenuTemplate,
} as Meta;

const ACTIONS = {
  // eventEmitterName: action('eventEmitterName'),
};


const Template: Story = (args) => ({
  props: {...args, ...ACTIONS},
  moduleMetadata: {
    imports: [
      IconButtonMenuModule,
    ]
  }
});

export const Default = Template.bind({});
Default.args = {};
