import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Meta, Story } from '@storybook/angular';
import { action } from '@storybook/addon-actions';
import { CodeEditorTemplate, CodeEditorModule } from '.';

export default {
  title: 'Templates/CodeEditor',
  component: CodeEditorTemplate,
} as Meta;

const ACTIONS = {
  // eventEmitterName: action('eventEmitterName'),
};


const Template: Story = (args) => ({
  props: {...args, ...ACTIONS},
  moduleMetadata: {
    imports: [
      CodeEditorModule,
    ]
  }
});

export const Default = Template.bind({});
Default.args = {};
