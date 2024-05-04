import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Meta, Story } from '@storybook/angular';
import { action } from '@storybook/addon-actions';
import { GridToolbarOrganism, GridToolbarModule } from '.';

export default {
  title: 'Organisms/GridToolbar',
  component: GridToolbarOrganism,
} as Meta;

const ACTIONS = {
  // eventEmitterName: action('eventEmitterName'),
};


const Template: Story = (args) => ({
  props: {...args, ...ACTIONS},
  moduleMetadata: {
    imports: [
      GridToolbarModule,
    ]
  }
});

export const Default = Template.bind({});
Default.args = {};
