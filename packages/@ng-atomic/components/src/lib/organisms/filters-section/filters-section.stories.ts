import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Meta, Story } from '@storybook/angular';
import { action } from '@storybook/addon-actions';
import { FiltersSectionOrganism, FiltersSectionModule } from '.';

export default {
  title: 'Organisms/FiltersSection',
  component: FiltersSectionOrganism,
} as Meta;

const ACTIONS = {
  // eventEmitterName: action('eventEmitterName'),
};


const Template: Story = (args) => ({
  props: {...args, ...ACTIONS},
  moduleMetadata: {
    imports: [
      FiltersSectionModule,
    ]
  }
});

export const Default = Template.bind({});
Default.args = {};
