import { NgModule } from "@angular/core";
import { IndexPageStore } from "@ng-atomic/components/pages/_index";
import { FormPageStore } from "@ng-atomic/components/pages/form";
import { TermsPageStore } from "./terms";

@NgModule({})
export class NgAtomicPagesModule {
  static forRoot() {
    return {
      ngModule: NgAtomicPagesModule,
      providers: [
        FormPageStore.Config.provide(),
        IndexPageStore.Config.provide(),
        TermsPageStore.Config.provide(),
      ],
    }
  }
}
