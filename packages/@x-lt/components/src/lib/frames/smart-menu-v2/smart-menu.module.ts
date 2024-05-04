import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DrawerModule } from '@ng-atomic/components/frames/drawer';
import { SmartMenuFrame } from './smart-menu.frame';


@NgModule({
  declarations: [SmartMenuFrame],
  imports: [
    CommonModule,
    // Frames
    DrawerModule,
  ],
  exports: [SmartMenuFrame]
})
export class SmartMenuModule { }
