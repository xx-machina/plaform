import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Meta, Story } from '@storybook/angular';
import { action } from '@storybook/addon-actions';
import { TabEditorTemplate, TabEditorModule } from '.';

export default {
  title: 'Templates/TabEditor',
  component: TabEditorTemplate,
} as Meta;

const ACTIONS = {
  // eventEmitterName: action('eventEmitterName'),
};


const Template: Story = (args) => ({
  props: {...args, ...ACTIONS},
  moduleMetadata: {
    imports: [
      TabEditorModule,
    ]
  }
});

export const Default = Template.bind({});
Default.args = {};
