import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Meta, Story } from '@storybook/angular';
import { action } from '@storybook/addon-actions';
import { DonationTemplate, DonationModule } from '.';

export default {
  title: 'Templates/Donation',
  component: DonationTemplate,
} as Meta;

const ACTIONS = {
  // eventEmitterName: action('eventEmitterName'),
};


const Template: Story = (args) => ({
  props: {...args, ...ACTIONS},
  moduleMetadata: {
    imports: [
      DonationModule,
    ]
  }
});

export const Default = Template.bind({});
Default.args = {};
