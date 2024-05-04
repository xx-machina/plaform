import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TextInputFieldModule } from '@ng-atomic/components/molecules/text-input-field';
import { CapacityAndAmountInputSectionOrganism } from './capacity-and-amount-input-section.organism';



@NgModule({
  declarations: [CapacityAndAmountInputSectionOrganism],
  imports: [
    CommonModule,
    // Molecules
    TextInputFieldModule,
  ],
  exports: [CapacityAndAmountInputSectionOrganism]
})
export class CapacityAndAmountInputSectionModule { }
