import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Meta, Story } from '@storybook/angular';
import { action } from '@storybook/addon-actions';
import { ToolbarOrganism, ToolbarModule } from '.';

export default {
  title: 'Organisms/Toolbar',
  component: ToolbarOrganism,
} as Meta;

const ACTIONS = {
  // eventEmitterName: action('eventEmitterName'),
};


const Template: Story = (args) => ({
  props: {...args, ...ACTIONS},
  moduleMetadata: {
    imports: [
      ToolbarModule,
    ]
  }
});

export const Default = Template.bind({});
Default.args = {};
