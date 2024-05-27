import { ChangeDetectionStrategy, Component, Directive, inject, input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Actions, InjectableComponent, TokenizedType, _computed } from '@ng-atomic/core';
import { NgAtomicComponent } from '@ng-atomic/core';
import { SmartMenuButtonAtom } from '@ng-atomic/components/atoms/smart-menu-button';
import { makeConfig } from '@ng-atomic/common/services/ui';

@TokenizedType()
@Directive({ standalone: true, selector: 'organisms-navigator' })
export class NavigatorOrganismStore extends InjectableComponent {
  static readonly Config = makeConfig(() => {
    return () => ({
      title: undefined as string | undefined,
      startActions: [{ id: 'menu', icon: 'menu', name: 'menu' }] as Actions,
      endActions: [] as Actions,
    });
  }, ['components', 'organisms', 'navigator']);
  protected readonly config = NavigatorOrganismStore.Config.inject(); 
  readonly startActions = input(_computed(() => this.config().startActions));
  readonly endActions = input(_computed(() => this.config().endActions));
  readonly title = input(_computed(() => this.config().title))
}

@Component({
  selector: 'organisms-navigator',
  standalone: true,
  imports: [
    MatButtonModule,
    MatIconModule,
    MatToolbarModule,
    SmartMenuButtonAtom,
  ],
  template: `
  <mat-toolbar color="primary">
    <div>
      @if((store.startActions())?.length) {
        <atoms-smart-menu-button
          [actions]="store.startActions()"
          (action)="dispatch($event)"
        />
      }
    </div>
    <div>
      @if (store.title()) {
        <span>{{ store.title() }}</span>
      } @else {
        <ng-content />
      }
    </div>
    <div>
      @if((store.endActions())?.length) {
        <atoms-smart-menu-button
          [actions]="store.endActions()"
          (action)="dispatch($event)"
        />
      }
    </div>
  </mat-toolbar>
  `,
  styleUrls: ['./navigator.organism.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  hostDirectives: [
    {
      directive: NavigatorOrganismStore,
      inputs: ['startActions', 'endActions', 'title'],
    }
  ]
})
export class NavigatorOrganism extends NgAtomicComponent {
  protected readonly store = inject(NavigatorOrganismStore);
}
