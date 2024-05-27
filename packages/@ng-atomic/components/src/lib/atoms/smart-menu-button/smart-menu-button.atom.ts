import { ChangeDetectionStrategy, Component, Directive, Pipe, computed, inject, input, PipeTransform } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { Action, InjectableComponent, NgAtomicComponent, TokenizedType } from '@ng-atomic/core';

@Pipe({ standalone: true, name: 'stope' })
export class StopPipe implements PipeTransform {
  transform($event: Event) {
    $event.stopPropagation();
    $event.preventDefault();
    return $event;
  }
}

@TokenizedType()
@Directive({ standalone: true, selector: 'atoms-smart-menu-button' })
export class SmartMenuButtonAtomStore extends InjectableComponent {
  readonly actions = input<Action[]>([]);
  readonly type = input<'button' | 'icon-button'>('icon-button');
  readonly action = computed(() => this.actions()?.[0]);
}

@Component({
  selector: 'atoms-smart-menu-button',
  standalone: true,
  imports: [
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    StopPipe
  ],
  template: `
  @switch(store.actions()?.length ?? 0) {
    @case(0) { }
    @case(1) {
      @switch (store.type()) {
        @case('button') {
          <button mat-button (click)="dispatch(store.action()); $event.stopPropagation()" [disabled]="store.action().disabled">
            {{ store.action()?.name }}
          </button>
        }
        @case('icon-button') {
          <button mat-icon-button (click)="dispatch(store.action()); $event.stopPropagation();" [disabled]="store.action().disabled">
            <mat-icon>{{ store.action()?.icon }}</mat-icon>
          </button>
        }
      }
    }
    @default {
      @if (store.actions().length) {
        @switch (store.type()) {
          @case('button') {
            <button mat-button [matMenuTriggerFor]="menu">
              {{ store.actions().length }} actions
            </button>
          }
          @case('icon-button') {
            <button mat-icon-button [matMenuTriggerFor]="menu">
              <mat-icon>more_vert</mat-icon>
            </button>
          }
        }
      }
    }
  }

  <mat-menu #menu="matMenu">
    @for (action of store.actions(); track action.id) {
      <button mat-menu-item (click)="dispatch(action)" [disabled]="action.disabled">{{ action.name }}</button>
    }
  </mat-menu>
  `,
  styleUrls: ['./smart-menu-button.atom.scss'],
  changeDetection: ChangeDetectionStrategy.Default,
  hostDirectives: [
    {
      directive: SmartMenuButtonAtomStore,
      inputs: ['actions', 'type'],
    }
  ]
})
export class SmartMenuButtonAtom extends NgAtomicComponent {
  protected store = inject(SmartMenuButtonAtomStore);
}
