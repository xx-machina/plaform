import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatLegacyProgressSpinnerModule as MatProgressSpinnerModule } from '@angular/material/legacy-progress-spinner';

import { LineUpFrame } from './line-up.frame';


@NgModule({
  declarations: [LineUpFrame],
  imports: [
    CommonModule,
    MatProgressSpinnerModule
  ],
  exports: [LineUpFrame]
})
export class LineUpModule { }