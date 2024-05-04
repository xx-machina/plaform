import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Meta, Story } from '@storybook/angular';
import { action } from '@storybook/addon-actions';
import { EditorComponent, EditorModule } from '.';

export default {
  title: 'Components/Editor',
  component: EditorComponent,
} as Meta;

const ACTIONS = {
  // eventEmitterName: action('eventEmitterName'),
};


const Template: Story = (args) => ({
  props: {...args, ...ACTIONS},
  moduleMetadata: {
    imports: [
      EditorModule,
    ]
  }
});

export const Default = Template.bind({});
Default.args = {};
