import { NgModule, importProvidersFrom } from "@angular/core";
import { NgAtomicAtomsModule } from "@ng-atomic/components/atoms";
import { NgAtomicMoleculesModule } from "@ng-atomic/components/molecules";
import { NgAtomicOrganismsModule } from "@ng-atomic/components/organisms";
import { NgAtomicTemplatesModule } from "@ng-atomic/components/templates";
import { NgAtomicFramesModule } from "@ng-atomic/components/frames";
import { NgAtomicPagesModule } from "@ng-atomic/components/pages";
import { NgAtomicSheetsModule } from '@ng-atomic/components/sheets';

@NgModule({})
export class NgAtomicComponentsModule {
  static forRoot() {
    return {
      ngModule: NgAtomicComponentsModule,
      providers: [
        importProvidersFrom(NgAtomicAtomsModule.forRoot()),
        importProvidersFrom(NgAtomicMoleculesModule.forRoot()),
        importProvidersFrom(NgAtomicOrganismsModule.forRoot()),
        importProvidersFrom(NgAtomicTemplatesModule.forRoot()),
        importProvidersFrom(NgAtomicPagesModule.forRoot()),
        importProvidersFrom(NgAtomicFramesModule.forRoot()),
        importProvidersFrom(NgAtomicSheetsModule.forRoot()),
      ],
    }
  }
}
