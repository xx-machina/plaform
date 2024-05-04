import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Meta, Story } from '@storybook/angular';
import { action } from '@storybook/addon-actions';
import { TreeSectionOrganism, TreeSectionModule } from '.';

export default {
  title: 'Organisms/TreeSection',
  component: TreeSectionOrganism,
} as Meta;

const ACTIONS = {
  // eventEmitterName: action('eventEmitterName'),
};


const Template: Story = (args) => ({
  props: {...args, ...ACTIONS},
  moduleMetadata: {
    imports: [
      TreeSectionModule,
    ]
  }
});

export const Default = Template.bind({});
Default.args = {};
