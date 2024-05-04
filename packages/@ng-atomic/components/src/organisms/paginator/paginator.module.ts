import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatLegacyPaginatorModule as MatPaginatorModule } from '@angular/material/legacy-paginator';
import { AutoLayoutModule } from '@ng-atomic/components/frames/auto-layout';
import { ChipsInputFieldModule } from '@ng-atomic/components/molecules/chips-input-field';

import { PaginatorOrganism } from './paginator.organism';

@NgModule({
  declarations: [
    PaginatorOrganism
  ],
  imports: [
    CommonModule,
    // Materials
    MatPaginatorModule,
    // Frames
    AutoLayoutModule,
    // Molecules
    ChipsInputFieldModule,
  ],
  exports: [
    PaginatorOrganism
  ]
})
export class PaginatorModule { }
