import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Meta, Story } from '@storybook/angular';
import { action } from '@storybook/addon-actions';
import { ActionInputSectionOrganism, ActionInputSectionModule } from '.';

export default {
  title: 'Organisms/ActionInputSection',
  component: ActionInputSectionOrganism,
} as Meta;

const ACTIONS = {
  // eventEmitterName: action('eventEmitterName'),
};


const Template: Story = (args) => ({
  props: {...args, ...ACTIONS},
  moduleMetadata: {
    imports: [
      ActionInputSectionModule,
    ]
  }
});

export const Default = Template.bind({});
Default.args = {};
