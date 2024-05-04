import { NgModule, Pipe } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatLegacyTableModule as MatTableModule } from '@angular/material/legacy-table';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyTooltipModule as MatTooltipModule } from '@angular/material/legacy-tooltip';
import { SmartExpModule } from '@ng-atomic/common/pipes/smart-exp';
import { SmartColumnMolecule } from './smart-column.molecule';
import { DataAccessorPipe } from '@ng-atomic/common/pipes/data-accessor';

@NgModule({
  declarations: [
    SmartColumnMolecule,
  ],
  imports: [
    CommonModule,
    ClipboardModule,
    // Pipes
    SmartExpModule,
    DataAccessorPipe,
    // Materials
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatTooltipModule,
  ],
  exports: [SmartColumnMolecule],
  bootstrap: [SmartColumnMolecule],
})
export class SmartColumnModule { }
