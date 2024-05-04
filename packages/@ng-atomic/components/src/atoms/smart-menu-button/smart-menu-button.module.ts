import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyMenuModule as MatMenuModule } from '@angular/material/legacy-menu';

import { SmartMenuButtonAtom } from './smart-menu-button.atom';


@NgModule({
  declarations: [SmartMenuButtonAtom],
  imports: [
    CommonModule,
    // Material
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
  ],
  exports: [SmartMenuButtonAtom]
})
export class SmartMenuButtonModule { }