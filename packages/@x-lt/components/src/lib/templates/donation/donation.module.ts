import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScrollModule } from '@ng-atomic/components/frames/scroll';
import { AutoLayoutModule} from '@ng-atomic/components/frames/auto-layout';
import { ActionButtonsSectionModule } from '@ng-atomic/components/organisms/action-buttons-section';
import { NavigatorModule } from '@ng-atomic/components/organisms/navigator';
import { CardInputSectionModule } from '@ng-atomic/components/organisms/card-input-section';
import { CvcAndExpInputSectionModule } from '@ng-atomic/components/organisms/cvc-and-exp-input-section';
import { TextareaSectionModule } from '@ng-atomic/components/organisms/textarea-section';
import { TextInputSectionModule } from '@ng-atomic/components/organisms/text-input-section';
import { CapacityAndAmountInputSectionModule } from '../../organisms/capacity-and-amount-input-section';
import { DonationTemplate } from './donation.template';

import { MatStepperModule } from '@angular/material/stepper';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [DonationTemplate],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    // Frames
    AutoLayoutModule,
    ScrollModule,
    // Organisms
    ActionButtonsSectionModule,
    NavigatorModule,
    CapacityAndAmountInputSectionModule,
    CardInputSectionModule,
    CvcAndExpInputSectionModule,
    TextareaSectionModule,
    TextInputSectionModule,
    // Material
    MatStepperModule,
  ],
  exports: [DonationTemplate]
})
export class DonationModule { }
