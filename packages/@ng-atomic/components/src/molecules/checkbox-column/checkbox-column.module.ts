import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatLegacyTableModule as MatTableModule } from '@angular/material/legacy-table';
import { MatLegacyCheckboxModule as MatCheckboxModule, MAT_LEGACY_CHECKBOX_DEFAULT_OPTIONS as MAT_CHECKBOX_DEFAULT_OPTIONS, MatLegacyCheckboxDefaultOptions as MatCheckboxDefaultOptions } from '@angular/material/legacy-checkbox';

import { CheckboxColumnMolecule } from './checkbox-column.molecule';



@NgModule({
  declarations: [
    CheckboxColumnMolecule
  ],
  imports: [
    CommonModule,
    // Materials
    MatTableModule,
    MatCheckboxModule,
  ],
  exports: [CheckboxColumnMolecule],
  providers: [
    {provide: MAT_CHECKBOX_DEFAULT_OPTIONS, useValue: { clickAction: 'noop' } as MatCheckboxDefaultOptions}
  ],
  bootstrap: [CheckboxColumnMolecule],
})
export class CheckboxColumnModule { }
