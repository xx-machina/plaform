import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatLegacyTableModule as MatTableModule } from '@angular/material/legacy-table';
import { MatLegacyMenuModule as MatMenuModule } from '@angular/material/legacy-menu';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatIconModule } from '@angular/material/icon';
import { SmartMenuButtonModule } from '@ng-atomic/components/atoms/smart-menu-button';

import { ActionsColumnMolecule } from './actions-column.molecule';

@NgModule({
  declarations: [
    ActionsColumnMolecule
  ],
  imports: [
    CommonModule,
    // Materials
    MatTableModule,
    MatMenuModule,
    MatButtonModule,
    MatIconModule,
    // Atoms
    SmartMenuButtonModule,
  ],
  exports: [ActionsColumnMolecule],
  bootstrap: [ActionsColumnMolecule],
})
export class ActionsColumnModule { }
