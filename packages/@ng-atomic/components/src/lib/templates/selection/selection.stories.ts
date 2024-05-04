import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Meta, Story } from '@storybook/angular';
import { action } from '@storybook/addon-actions';
import { SelectionTemplate, SelectionModule } from '.';

export default {
  title: 'Templates/Selection',
  component: SelectionTemplate,
} as Meta;

const ACTIONS = {
  // eventEmitterName: action('eventEmitterName'),
};


const Template: Story = (args) => ({
  props: {...args, ...ACTIONS},
  moduleMetadata: {
    imports: [
      SelectionModule,
    ]
  }
});

export const Default = Template.bind({});
Default.args = {};
