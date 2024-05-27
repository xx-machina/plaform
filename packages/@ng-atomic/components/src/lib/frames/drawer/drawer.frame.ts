import { ChangeDetectionStrategy, Component, Directive, effect, inject, input } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { InjectableComponent, NgAtomicComponent, TokenizedType } from '@ng-atomic/core';

@TokenizedType()
@Directive({ standalone: true, selector: 'frames-drawer' })
export class DrawerFrameStore extends InjectableComponent {
  readonly opened = input<boolean>(false);
  readonly mode = input<'side' | 'over' | 'push'>('side');
  readonly hasBackdrop = input<boolean>(true);
  readonly position = input<'start' | 'end'>('start');
}

@Component({
  selector: 'frames-drawer',
  standalone: true,
  imports: [
    MatSidenavModule,
  ],
  template: `
  <mat-drawer-container [autosize]="false" [hasBackdrop]="store.hasBackdrop()">
    <mat-drawer #drawer [opened]="store.opened()" [mode]="store.mode()" [position]="store.position()">
      <ng-content select=[drawer] />
    </mat-drawer>
    <mat-drawer-content>
      <ng-content select=[contents] />
    </mat-drawer-content>
  </mat-drawer-container>`,
  styleUrls: ['./drawer.frame.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  hostDirectives: [
    {
      directive: DrawerFrameStore,
      inputs: ['opened', 'mode', 'hasBackdrop', 'position'],
    }
  ],
})
export class DrawerFrame extends NgAtomicComponent {
  readonly store = inject(DrawerFrameStore);
}
