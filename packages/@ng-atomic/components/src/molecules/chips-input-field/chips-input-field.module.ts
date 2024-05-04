import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChipsInputModule } from '@ng-atomic/components/atoms/chips-input';

import { ChipsInputFieldMolecule } from './chips-input-field.molecule';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { ReactiveFormsModule } from '@angular/forms';
import { MatLegacyChipsModule as MatChipsModule } from '@angular/material/legacy-chips';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
  declarations: [
    ChipsInputFieldMolecule
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    // Materials
    MatChipsModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatInputModule,
    // Atoms
    ChipsInputModule,
  ],
  exports: [ChipsInputFieldMolecule],
  bootstrap: [ChipsInputFieldMolecule],
})
export class ChipsInputFieldModule { }
