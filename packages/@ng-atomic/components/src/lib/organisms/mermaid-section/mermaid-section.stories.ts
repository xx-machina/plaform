import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Meta, Story } from '@storybook/angular';
import { action } from '@storybook/addon-actions';
import { MermaidSectionOrganism, MermaidSectionModule } from '.';

export default {
  title: 'Organisms/MermaidSection',
  component: MermaidSectionOrganism,
} as Meta;

const ACTIONS = {
  // eventEmitterName: action('eventEmitterName'),
};


const Template: Story = (args) => ({
  props: {...args, ...ACTIONS},
  moduleMetadata: {
    imports: [
      MermaidSectionModule,
    ]
  }
});

export const Default = Template.bind({});
Default.args = {};
