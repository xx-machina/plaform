import { NgModule } from "@angular/core";
import { provideComponent } from "@ng-atomic/common/core";
import { MenuFooterOrganismStore } from "./menu-footer";
import { MenuHeaderOrganismStore } from "./menu-header";
import { NavigationListOrganismStore } from "./navigation-list";

@NgModule({})
export class NgAtomicOrganismsModule {
  static forRoot() {
    return {
      ngModule: NgAtomicOrganismsModule,
      providers: [
        provideComponent(MenuHeaderOrganismStore, () => import('./menu-header').then(m => m.MenuHeaderOrganism)),
        provideComponent(MenuFooterOrganismStore, () => import('./menu-footer').then(m => m.MenuFooterOrganism)),
        provideComponent(NavigationListOrganismStore, () => import('./navigation-list').then(m => m.NavigationListOrganism)),
      ]
    }
  }
}