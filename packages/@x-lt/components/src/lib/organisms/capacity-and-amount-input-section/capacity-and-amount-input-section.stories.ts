import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Meta, Story } from '@storybook/angular';
import { action } from '@storybook/addon-actions';
import { CapacityAndAmountInputSectionOrganism, CapacityAndAmountInputSectionModule } from '.';

export default {
  title: 'Organisms/CapacityAndAmountInputSection',
  component: CapacityAndAmountInputSectionOrganism,
} as Meta;

const ACTIONS = {
  // eventEmitterName: action('eventEmitterName'),
};


const Template: Story = (args) => ({
  props: {...args, ...ACTIONS},
  moduleMetadata: {
    imports: [
      CapacityAndAmountInputSectionModule,
    ]
  }
});

export const Default = Template.bind({});
Default.args = {};
