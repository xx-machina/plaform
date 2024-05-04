import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatLegacySelectModule as MatSelectModule } from '@angular/material/legacy-select';

import { SelectInputFieldMolecule } from './select-input-field.molecule';



@NgModule({
  declarations: [SelectInputFieldMolecule],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    // Materials
    MatSelectModule,
  ],
  exports: [SelectInputFieldMolecule],
  bootstrap: [SelectInputFieldMolecule],
})
export class SelectInputFieldModule { }
