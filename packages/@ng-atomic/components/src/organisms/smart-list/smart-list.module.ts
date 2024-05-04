import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SmartListOrganism } from './smart-list.organism';
import { MatLegacyListModule as MatListModule } from '@angular/material/legacy-list';
import { MatIconModule } from '@angular/material/icon';
import { MatRippleModule } from '@angular/material/core';
import { DataAccessorPipe } from '@ng-atomic/common/pipes/data-accessor';

@NgModule({
  declarations: [
    SmartListOrganism,
  ],
  imports: [
    CommonModule,
    MatListModule,
    MatIconModule,
    MatRippleModule,
    DataAccessorPipe,
  ],
  exports: [
    SmartListOrganism
  ]
})
export class SmartListModule { }
