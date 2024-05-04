import { NgModule } from "@angular/core";

@NgModule({})
export class NgAtomicExtrasModule {
  static forRoot() {
    return {
      ngModule: NgAtomicExtrasModule,
      providers: []
    };
  }
}
