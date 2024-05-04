import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';

import { TextareaFieldMolecule } from './textarea-field.molecule';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [TextareaFieldMolecule],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    // Material
    MatInputModule,
  ],
  exports: [TextareaFieldMolecule],
  bootstrap: [TextareaFieldMolecule],
})
export class TextareaFieldModule { }
