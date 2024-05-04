import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatLegacyChipsModule as MatChipsModule } from '@angular/material/legacy-chips';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { ChipsInputAtom } from './chips-input.atom';


@NgModule({
  declarations: [
    ChipsInputAtom
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    // Materials
    MatChipsModule,
    MatIconModule,
    MatInputModule,
  ],
  exports: [
    ChipsInputAtom
  ],
  bootstrap: [ChipsInputAtom],
})
export class ChipsInputModule { }