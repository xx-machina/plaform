import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Meta, Story } from '@storybook/angular';
import { action } from '@storybook/addon-actions';
import { GraphqlEditorOrganism, GraphqlEditorModule } from '.';

export default {
  title: 'Organisms/GraphqlEditor',
  component: GraphqlEditorOrganism,
} as Meta;

const ACTIONS = {
  // eventEmitterName: action('eventEmitterName'),
};


const Template: Story = (args) => ({
  props: {...args, ...ACTIONS},
  moduleMetadata: {
    imports: [
      GraphqlEditorModule,
    ]
  }
});

export const Default = Template.bind({});
Default.args = {};
