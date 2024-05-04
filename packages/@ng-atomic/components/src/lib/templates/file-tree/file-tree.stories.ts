import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Meta, Story } from '@storybook/angular';
import { action } from '@storybook/addon-actions';
import { FileTreeTemplate, FileTreeModule } from '.';

export default {
  title: 'Templates/FileTree',
  component: FileTreeTemplate,
} as Meta;

const ACTIONS = {
  // eventEmitterName: action('eventEmitterName'),
};


const Template: Story = (args) => ({
  props: {...args, ...ACTIONS},
  moduleMetadata: {
    imports: [
      FileTreeModule,
    ]
  }
});

export const Default = Template.bind({});
Default.args = {};
