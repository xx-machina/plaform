import { NgModule } from "@angular/core";

@NgModule({})
export class NgAtomicFramesModule {
  static forRoot() {
    return {
      ngModule: NgAtomicFramesModule,
      providers: []
    };
  }
}
