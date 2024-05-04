import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatLegacyTableModule as MatTableModule } from '@angular/material/legacy-table';
import { MatLegacyCheckboxModule as MatCheckboxModule } from '@angular/material/legacy-checkbox';
import { MatLegacyMenuModule as MatMenuModule } from '@angular/material/legacy-menu';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatIconModule } from '@angular/material/icon';
import { DomainModule } from '@ng-atomic/common/pipes/domain';
import { ActionsColumnModule } from '@ng-atomic/components/molecules/actions-column';
import { CheckboxColumnModule } from '@ng-atomic/components/molecules/checkbox-column';
import { SmartColumnModule } from '@ng-atomic/components/molecules/smart-column';

import { SmartTableOrganism } from './smart-table.organism';

@NgModule({
  declarations: [
    SmartTableOrganism,
  ],
  imports: [
    CommonModule,
    // Pipes
    DomainModule,
    // Material
    MatTableModule,
    MatCheckboxModule,
    MatMenuModule,
    MatButtonModule,
    MatIconModule,
    // Molecules
    ActionsColumnModule,
    CheckboxColumnModule,
    SmartColumnModule,
  ],
  exports: [
    SmartTableOrganism
  ]
})
export class SmartTableModule { }
