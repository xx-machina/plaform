import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatLegacyProgressSpinnerModule as MatProgressSpinnerModule } from '@angular/material/legacy-progress-spinner';

import { LoadingTemplate } from './loading.template';


@NgModule({
  declarations: [
    LoadingTemplate
  ],
  imports: [
    CommonModule,
    // Materials
    MatProgressSpinnerModule,
  ],
  exports: [
    LoadingTemplate
  ],
  bootstrap: [
    LoadingTemplate,
  ],
})
export class LoadingModule { }
