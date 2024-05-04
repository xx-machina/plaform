import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Meta, Story } from '@storybook/angular';
import { action } from '@storybook/addon-actions';
import { TreeColumnMolecule, TreeColumnModule } from '.';

export default {
  title: 'Molecules/TreeColumn',
  component: TreeColumnMolecule,
} as Meta;

const ACTIONS = {
  // eventEmitterName: action('eventEmitterName'),
};


const Template: Story = (args) => ({
  props: {...args, ...ACTIONS},
  moduleMetadata: {
    imports: [
      TreeColumnModule,
    ]
  }
});

export const Default = Template.bind({});
Default.args = {};
