import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Meta, Story } from '@storybook/angular';
import { action } from '@storybook/addon-actions';
import { MenuHeaderOrganism, MenuHeaderModule } from '.';

export default {
  title: 'Organisms/MenuHeader',
  component: MenuHeaderOrganism,
} as Meta;

const ACTIONS = {
  // eventEmitterName: action('eventEmitterName'),
};


const Template: Story = (args) => ({
  props: {...args, ...ACTIONS},
  moduleMetadata: {
    imports: [
      MenuHeaderModule,
    ]
  }
});

export const Default = Template.bind({});
Default.args = {};
