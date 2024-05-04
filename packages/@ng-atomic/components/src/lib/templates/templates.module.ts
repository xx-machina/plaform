import { NgModule } from "@angular/core";
import { provideComponent } from "@ng-atomic/core";
import { IconButtonMenuTemplateStore } from "@ng-atomic/components/templates/icon-button-menu";
import { MenuTemplateStore } from "@ng-atomic/components/templates/menu";

@NgModule({})
export class NgAtomicTemplatesModule {
  static forRoot() {
    return {
      ngModule: NgAtomicTemplatesModule,
      providers: [
        provideComponent(IconButtonMenuTemplateStore, () => import('@ng-atomic/components/templates/icon-button-menu').then(m => m.IconButtonMenuTemplate)),
        provideComponent(MenuTemplateStore, () => import('@ng-atomic/components/templates/menu').then(m => m.MenuTemplate)),
      ],
    }
  }
}
