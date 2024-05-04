import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Meta, Story } from '@storybook/angular';
import { action } from '@storybook/addon-actions';
import { NestedMenuMolecule, NestedMenuModule } from '.';

export default {
  title: 'Molecules/NestedMenu',
  component: NestedMenuMolecule,
} as Meta;

const ACTIONS = {
  // eventEmitterName: action('eventEmitterName'),
};


const Template: Story = (args) => ({
  props: {...args, ...ACTIONS},
  moduleMetadata: {
    imports: [
      NestedMenuModule,
    ]
  }
});

export const Default = Template.bind({});
Default.args = {};
