import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Meta, Story } from '@storybook/angular';
import { action } from '@storybook/addon-actions';
import { SelectionListOrganism, SelectionListModule } from '.';

export default {
  title: 'Organisms/SelectionList',
  component: SelectionListOrganism,
} as Meta;

const ACTIONS = {
  // eventEmitterName: action('eventEmitterName'),
};


const Template: Story = (args) => ({
  props: {...args, ...ACTIONS},
  moduleMetadata: {
    imports: [
      SelectionListModule,
    ]
  }
});

export const Default = Template.bind({});
Default.args = {};
