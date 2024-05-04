import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatLegacyListModule as MatListModule } from '@angular/material/legacy-list';
import { NavigationListItemModule } from '@ng-atomic/components/molecules/navigation-list-item';

import { NavigationListOrganism } from './navigation-list.organism';

@NgModule({
  declarations: [NavigationListOrganism],
  imports: [
    CommonModule,
    // Materials
    MatListModule,
    // Molecules
    NavigationListItemModule,
  ],
  exports: [NavigationListOrganism]
})
export class NavigationListModule { }
