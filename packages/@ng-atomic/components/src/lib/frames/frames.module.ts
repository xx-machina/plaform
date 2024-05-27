import { NgModule } from '@angular/core';
import { provideComponent } from '@ng-atomic/core';
import { SideNavFrame, SideNavFrameStore } from '@ng-atomic/components/frames/side-nav';
import { RouterOutletFrameStore } from '@ng-atomic/components/frames/router-outlet';
import { ColumnsFrameStore } from '@ng-atomic/components/frames/columns';
import { AppFrameStore } from '@ng-atomic/components/frames/app';
import { DrawerFrameStore } from '@ng-atomic/components/frames/drawer';
import { FabFrameStore } from '@ng-atomic/components/frames/fab';

@NgModule({})
export class NgAtomicFramesModule {
  static forRoot() {
    return {
      ngModule: NgAtomicFramesModule,
      providers: [
        AppFrameStore.Config.provide(),
        provideComponent(AppFrameStore, () => import('@ng-atomic/components/frames/app').then(m => m.AppFrame)),
        ColumnsFrameStore.Config.provide(),
        provideComponent(ColumnsFrameStore, () => import('@ng-atomic/components/frames/columns').then(m => m.ColumnsFrame)),
        FabFrameStore.Config.provide(),
        provideComponent(FabFrameStore, () => import('@ng-atomic/components/frames/fab').then(m => m.FabFrame)),
        // DrawerFrameStore.Config.provide(),
        provideComponent(DrawerFrameStore, () => import('@ng-atomic/components/frames/drawer').then(m => m.DrawerFrame)),
        SideNavFrameStore.Config.provide(),
        provideComponent(SideNavFrame, () => import('@ng-atomic/components/frames/side-nav').then(m => m.SideNavFrame)),
        RouterOutletFrameStore.Config.provide(),
        provideComponent(RouterOutletFrameStore, () => import('@ng-atomic/components/frames/router-outlet').then(m => m.RouterOutletFrame)),
      ]
    };
  }
}
