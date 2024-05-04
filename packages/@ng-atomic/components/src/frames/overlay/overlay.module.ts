import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatLegacyProgressSpinnerModule as MatProgressSpinnerModule } from '@angular/material/legacy-progress-spinner';
import { OverlayFrame } from './overlay.frame';

@NgModule({
  declarations: [OverlayFrame],
  imports: [
    CommonModule,
    MatProgressSpinnerModule
  ],
  exports: [
    OverlayFrame
  ]
})
export class OverlayModule { }

