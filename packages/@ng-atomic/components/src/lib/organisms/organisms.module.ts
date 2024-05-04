import { NgModule } from "@angular/core";
import { provideComponent } from "@ng-atomic/core";
import { MenuFooterOrganismStore } from "@ng-atomic/components/organisms/menu-footer";
import { MenuHeaderOrganismStore } from "@ng-atomic/components/organisms/menu-header";
import { NavigationListOrganismStore } from "@ng-atomic/components/organisms/navigation-list";

@NgModule({})
export class NgAtomicOrganismsModule {
  static forRoot() {
    return {
      ngModule: NgAtomicOrganismsModule,
      providers: [
        provideComponent(MenuHeaderOrganismStore, () => import('@ng-atomic/components/organisms/menu-header').then(m => m.MenuHeaderOrganism)),
        provideComponent(MenuFooterOrganismStore, () => import('@ng-atomic/components/organisms/menu-footer').then(m => m.MenuFooterOrganism)),
        provideComponent(NavigationListOrganismStore, () => import('@ng-atomic/components/organisms/navigation-list').then(m => m.NavigationListOrganism)),
      ]
    }
  }
}