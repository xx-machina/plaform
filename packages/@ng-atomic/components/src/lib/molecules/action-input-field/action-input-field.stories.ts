import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Meta, Story } from '@storybook/angular';
import { action } from '@storybook/addon-actions';
import { ActionInputFieldMolecule, ActionInputFieldModule } from '.';

export default {
  title: 'Molecules/ActionInputField',
  component: ActionInputFieldMolecule,
} as Meta;

const ACTIONS = {
  // eventEmitterName: action('eventEmitterName'),
};


const Template: Story = (args) => ({
  props: {...args, ...ACTIONS},
  moduleMetadata: {
    imports: [
      ActionInputFieldModule,
    ]
  }
});

export const Default = Template.bind({});
Default.args = {};
