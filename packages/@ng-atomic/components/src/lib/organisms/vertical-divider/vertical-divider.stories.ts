import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Meta, Story } from '@storybook/angular';
import { action } from '@storybook/addon-actions';
import { VerticalDividerOrganism, VerticalDividerModule } from '.';

export default {
  title: 'Organisms/VerticalDivider',
  component: VerticalDividerOrganism,
} as Meta;

const ACTIONS = {
  // eventEmitterName: action('eventEmitterName'),
};


const Template: Story = (args) => ({
  props: {...args, ...ACTIONS},
  moduleMetadata: {
    imports: [
      VerticalDividerModule,
    ]
  }
});

export const Default = Template.bind({});
Default.args = {};
