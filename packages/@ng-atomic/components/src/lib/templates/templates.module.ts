import { NgModule } from "@angular/core";
import { provideComponent } from "@ng-atomic/common/core";
import { IconButtonMenuTemplateStore } from "./icon-button-menu";
import { MenuTemplateStore } from "./menu";

@NgModule({})
export class NgAtomicTemplatesModule {
  static forRoot() {
    return {
      ngModule: NgAtomicTemplatesModule,
      providers: [
        provideComponent(IconButtonMenuTemplateStore, () => import('./icon-button-menu').then(m => m.IconButtonMenuTemplate)),
        provideComponent(MenuTemplateStore, () => import('./menu').then(m => m.MenuTemplate)),
      ],
    }
  }
}
