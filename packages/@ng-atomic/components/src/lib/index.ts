import { NgModule, importProvidersFrom } from "@angular/core";
// import { NgAtomicMoleculesModule } from "./molecules";
// import { NgAtomicOrganismsModule } from "./organisms";
// import { NgAtomicTemplatesModule } from "./templates";

@NgModule({})
export class NgAtomicComponentsModule {
  static forRoot() {
    return {
      ngModule: NgAtomicComponentsModule,
      providers: [
        // importProvidersFrom(NgAtomicMoleculesModule.forRoot()),
        // importProvidersFrom(NgAtomicOrganismsModule.forRoot()),
        // importProvidersFrom(NgAtomicTemplatesModule.forRoot()),
      ],
    }
  }
}
