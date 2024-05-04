import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Meta, Story } from '@storybook/angular';
import { action } from '@storybook/addon-actions';
import { FileInputSectionOrganism, FileInputSectionModule } from '.';

export default {
  title: 'Organisms/FileInputSection',
  component: FileInputSectionOrganism,
} as Meta;

const ACTIONS = {
  // eventEmitterName: action('eventEmitterName'),
};


const Template: Story = (args) => ({
  props: {...args, ...ACTIONS},
  moduleMetadata: {
    imports: [
      FileInputSectionModule,
    ]
  }
});

export const Default = Template.bind({});
Default.args = {};
