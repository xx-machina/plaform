import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActionButtonsSectionModule } from '@ng-atomic/components/organisms/action-buttons-section';
import { NavigatorModule } from '@ng-atomic/components/organisms/navigator';
import { EntranceTemplate } from './entrance.template';



@NgModule({
  declarations: [EntranceTemplate],
  imports: [
    CommonModule,
    // Organisms
    ActionButtonsSectionModule,
    NavigatorModule,
  ],
  exports: [EntranceTemplate]
})
export class EntranceModule { }
