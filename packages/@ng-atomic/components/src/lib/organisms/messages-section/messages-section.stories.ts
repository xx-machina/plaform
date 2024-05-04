import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Meta, Story } from '@storybook/angular';
import { action } from '@storybook/addon-actions';
import { MessagesSectionOrganism, MessagesSectionModule } from '.';

export default {
  title: 'Organisms/MessagesSection',
  component: MessagesSectionOrganism,
} as Meta;

const ACTIONS = {
  // eventEmitterName: action('eventEmitterName'),
};


const Template: Story = (args) => ({
  props: {...args, ...ACTIONS},
  moduleMetadata: {
    imports: [
      MessagesSectionModule,
    ]
  }
});

export const Default = Template.bind({});
Default.args = {};
