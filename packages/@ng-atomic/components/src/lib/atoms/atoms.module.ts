import { NgModule } from '@angular/core';
import { provideComponent } from '@ng-atomic/core';
import { SmartMenuButtonAtomStore } from '@ng-atomic/components/atoms/smart-menu-button';

@NgModule({})
export class NgAtomicAtomsModule {
  static forRoot() {
    return {
      ngModule: NgAtomicAtomsModule,
      providers: [
        provideComponent(SmartMenuButtonAtomStore, () => import('@ng-atomic/components/atoms/smart-menu-button').then(m => m.SmartMenuButtonAtom)),
      ]
    }
  }
}
