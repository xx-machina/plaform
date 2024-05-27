import { NgModule } from "@angular/core";
import { provideComponent } from "@ng-atomic/core";
import { NavigationListItemMoleculeStore } from "@ng-atomic/components/molecules/navigation-list-item";
import { ChipsInputFieldMoleculeStore } from "@ng-atomic/components/molecules/chips-input-field";
import { HeaderMoleculeStore } from "@ng-atomic/components/molecules/header";
import { MatChipsModule } from "@angular/material/chips";
import { TextInputFieldMoleculeStore } from "@ng-atomic/components/molecules/text-input-field";
import { LoadingBoxMoleculeStore } from "@ng-atomic/components/molecules/loading-box";

@NgModule({
  imports: [
    MatChipsModule,
  ]
})
export class NgAtomicMoleculesModule {
  static forRoot() {
    return {
      ngModule: NgAtomicMoleculesModule,
      providers: [
        provideComponent(ChipsInputFieldMoleculeStore, () => import('@ng-atomic/components/molecules/chips-input-field').then(m => m.ChipsInputFieldMolecule)),
        ChipsInputFieldMoleculeStore.Config.provide(),
        provideComponent(HeaderMoleculeStore, () => import('@ng-atomic/components/molecules/header').then(m => m.HeaderMolecule)),
        LoadingBoxMoleculeStore.Config.provide(),
        provideComponent(LoadingBoxMoleculeStore, () => {
          return import('@ng-atomic/components/molecules/loading-box').then(m => m.LoadingBoxMolecule);
        }),
        provideComponent(NavigationListItemMoleculeStore, () => import('@ng-atomic/components/molecules/navigation-list-item').then(m => m.NavigationListItemMolecule)),
        provideComponent(
          NavigationListItemMoleculeStore,
          () => import('@ng-atomic/components/molecules/navigation-list-item')
            .then(m => m.NavigationListItemMolecule)
        ),
        provideComponent(TextInputFieldMoleculeStore, () => import('@ng-atomic/components/molecules/text-input-field').then(m => m.TextInputFieldMolecule)),
      ],
    };
  }
}