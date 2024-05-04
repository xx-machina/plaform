import { NgModule } from "@angular/core";
import { provideComponent } from "@ng-atomic/core";
import { NavigationListItemMoleculeStore } from "@ng-atomic/components/molecules/navigation-list-item";

@NgModule({})
export class NgAtomicMoleculesModule {
  static forRoot() {
    return {
      ngModule: NgAtomicMoleculesModule,
      providers: [
        provideComponent(
          NavigationListItemMoleculeStore,
          () => import('@ng-atomic/components/molecules/navigation-list-item')
            .then(m => m.NavigationListItemMolecule)
        ),
      ],
    };
  }
}