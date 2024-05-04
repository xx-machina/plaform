import { NgModule } from "@angular/core";
import { provideComponent } from "@ng-atomic/common/core";
import { NavigationListItemMoleculeStore } from "./navigation-list-item";

@NgModule({

})
export class NgAtomicMoleculesModule {
  static forRoot() {
    return {
      ngModule: NgAtomicMoleculesModule,
      providers: [
        provideComponent(NavigationListItemMoleculeStore, () => import('./navigation-list-item').then(m => m.NavigationListItemMolecule)),
      ],
    };
  }
}