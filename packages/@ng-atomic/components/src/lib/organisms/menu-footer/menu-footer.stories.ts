import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Meta, Story } from '@storybook/angular';
import { action } from '@storybook/addon-actions';
import { MenuFooterOrganism, MenuFooterModule } from '.';

export default {
  title: 'Organisms/MenuFooter',
  component: MenuFooterOrganism,
} as Meta;

const ACTIONS = {
  // eventEmitterName: action('eventEmitterName'),
};


const Template: Story = (args) => ({
  props: {...args, ...ACTIONS},
  moduleMetadata: {
    imports: [
      MenuFooterModule,
    ]
  }
});

export const Default = Template.bind({});
Default.args = {};
