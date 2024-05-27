import { NgModule } from "@angular/core";
import { provideComponent } from "@ng-atomic/core";
import { IconButtonMenuTemplateStore } from "@ng-atomic/components/templates/icon-button-menu";
import { MenuTemplateStore } from "@ng-atomic/components/templates/menu";
import { EntranceTemplateStore } from "@ng-atomic/components/templates/entrance";
import { IndexTemplateStore } from '@ng-atomic/components/templates/_index';
import { FormTemplateStore } from "@ng-atomic/components/templates/form";
import { BackgroundTemplateStore } from "@ng-atomic/components/templates/background";

@NgModule({})
export class NgAtomicTemplatesModule {
  static forRoot() {
    return {
      ngModule: NgAtomicTemplatesModule,
      providers: [
        provideComponent(IndexTemplateStore, () => {
          return import('@ng-atomic/components/templates/_index').then(m => m.IndexTemplate);
        }),
        provideComponent(BackgroundTemplateStore, () => {
          return import('@ng-atomic/components/templates/background').then(m => m.BackgroundTemplate);
        }),
        provideComponent(FormTemplateStore, () => {
          return import('@ng-atomic/components/templates/form').then(m => m.FormTemplate);
        }),
        provideComponent(EntranceTemplateStore, () => {
          return import('@ng-atomic/components/templates/entrance').then(m => m.EntranceTemplate);
        }),
        provideComponent(IconButtonMenuTemplateStore, () => {
          return import('@ng-atomic/components/templates/icon-button-menu').then(m => m.IconButtonMenuTemplate);
        }),
        provideComponent(MenuTemplateStore, () => {
          return import('@ng-atomic/components/templates/menu').then(m => m.MenuTemplate);
        }),
        IndexTemplateStore.Config.provide(),
        FormTemplateStore.Config.provide(),
      ],
    }
  }
}
