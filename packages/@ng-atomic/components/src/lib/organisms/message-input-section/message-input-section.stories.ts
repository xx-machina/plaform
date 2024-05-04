import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Meta, Story } from '@storybook/angular';
import { action } from '@storybook/addon-actions';
import { MessageInputSectionOrganism, MessageInputSectionModule } from '.';

export default {
  title: 'Organisms/MessageInputSection',
  component: MessageInputSectionOrganism,
} as Meta;

const ACTIONS = {
  // eventEmitterName: action('eventEmitterName'),
};


const Template: Story = (args) => ({
  props: {...args, ...ACTIONS},
  moduleMetadata: {
    imports: [
      MessageInputSectionModule,
    ]
  }
});

export const Default = Template.bind({});
Default.args = {};
