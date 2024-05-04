import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Meta, Story } from '@storybook/angular';
import { action } from '@storybook/addon-actions';
import { TerminalOrganism, TerminalModule } from '.';

export default {
  title: 'Organisms/Terminal',
  component: TerminalOrganism,
} as Meta;

const ACTIONS = {
  // eventEmitterName: action('eventEmitterName'),
};


const Template: Story = (args) => ({
  props: {...args, ...ACTIONS},
  moduleMetadata: {
    imports: [
      TerminalModule,
    ]
  }
});

export const Default = Template.bind({});
Default.args = {};
