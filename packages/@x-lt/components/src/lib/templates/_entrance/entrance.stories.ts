import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Meta, Story } from '@storybook/angular';
import { action } from '@storybook/addon-actions';
import { EntranceTemplate, EntranceModule } from '.';

export default {
  title: 'TemplateS/Entrance',
  component: EntranceTemplate,
} as Meta;

const ACTIONS = {
  // eventEmitterName: action('eventEmitterName'),
};


const Template: Story = (args) => ({
  props: {...args, ...ACTIONS},
  moduleMetadata: {
    imports: [
      EntranceModule,
    ]
  }
});

export const Default = Template.bind({});
Default.args = {};
