import { NgModule, importProvidersFrom } from "@angular/core";
import { NgAtomicMoleculesModule } from "@ng-atomic/components/molecules";
import { NgAtomicOrganismsModule } from "@ng-atomic/components/organisms";
import { NgAtomicTemplatesModule } from "@ng-atomic/components/templates";

@NgModule({})
export class NgAtomicComponentsModule {
  static forRoot() {
    return {
      ngModule: NgAtomicComponentsModule,
      providers: [
        importProvidersFrom(NgAtomicMoleculesModule.forRoot()),
        importProvidersFrom(NgAtomicOrganismsModule.forRoot()),
        importProvidersFrom(NgAtomicTemplatesModule.forRoot()),
      ],
    }
  }
}
