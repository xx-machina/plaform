import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatLegacyCardModule as MatCardModule } from '@angular/material/legacy-card';
import { CardFrame } from './card.frame';



@NgModule({
  declarations: [
    CardFrame
  ],
  imports: [
    CommonModule,
    // Material
    MatCardModule,
  ],
  exports: [
    CardFrame
  ]
})
export class CardModule { }