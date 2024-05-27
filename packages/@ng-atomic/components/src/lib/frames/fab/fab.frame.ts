import { ChangeDetectionStrategy, Component, Directive, inject, input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Action, _computed } from '@ng-atomic/core';
import { FabService } from './fab.service';
import { NgAtomicComponent } from '@ng-atomic/core';
import { makeConfig } from '@ng-atomic/common/services/ui';

@Directive({ standalone: true, selector: 'frames-fab' })
export class FabFrameStore {
  static readonly Config = makeConfig(() => {
    return () => ({
      actions: [] as Action[],
      hide: false,
    });
  }, ['components', 'frames', 'fab']);
  
  readonly config = FabFrameStore.Config.inject();
  readonly actions = input(_computed(() => this.config().actions));
  readonly hide = input(_computed(() => this.config().hide));
}

@Component({
  selector: 'frames-fab',
  standalone: true,
  imports: [
    MatIconModule,
    MatButtonModule,
  ],
  template: `
    <ng-content></ng-content>
    @for (action of store.actions(); track action.id) {
      <button mat-fab [color]="action?.color ?? 'primary'" (click)="dispatch(action)">
        <mat-icon>{{ action?.icon ?? 'add' }}</mat-icon>
      </button>
    }
  `,
  styleUrls: ['./fab.frame.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  hostDirectives: [
    {
      directive: FabFrameStore,
      inputs: ['actions', 'hide'],
    },
  ],
  host: {
    '[attr.hide]': 'store.hide()',
  }
})
export class FabFrame extends NgAtomicComponent {
  protected fab = inject(FabService);
  protected store = inject(FabFrameStore);
}
