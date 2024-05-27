import { ChangeDetectionStrategy, Component, Directive, inject, input } from '@angular/core';
import { DATA_ACCESSOR, defaultDataAccessor } from '@ng-atomic/common/pipes/data-accessor';
import { NgTemplateOutlet } from '@angular/common';
import { MatListModule } from '@angular/material/list';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatIconModule } from '@angular/material/icon';
import { MatRippleModule } from '@angular/material/core';
import { DataAccessorPipe } from '@ng-atomic/common/pipes/data-accessor';
import { _computed, Actions, InjectableComponent, NgAtomicComponent, TokenizedType } from '@ng-atomic/core';
import { KeysPipe } from '@ng-atomic/common/pipes/keys';
import { GroupedByPipe } from '@ng-atomic/common/pipes/grouped-by';
import { MatButtonModule } from '@angular/material/button';
import { ActionsPipe } from '@ng-atomic/common/pipes/actions';
import { SmartMenuButtonAtom } from '@ng-atomic/components/atoms/smart-menu-button';
import { makeConfig } from '@ng-atomic/common/services/ui';

export enum ActionId {
  CLICK_ITEM = '[@ng-atomic/components/organisms/smart-list] Click Item',
  ITEM_BUTTON_CLICK = '[@ng-atomic/components/organisms/smart-list] Item Button Click',
}

@TokenizedType()
@Directive({standalone: true})
export class SmartListOrganismStore<T> extends InjectableComponent {
  static readonly ActionId = ActionId;
  static readonly Config = makeConfig(() => {
    return (_, context) => ({
      items: [],
      itemActions: [],
      groupedBy: '',
      groupKeys: [],
      itemActionsType: (context.breakpoint === 'xSmall' ? 'dispatch' : 'menu') as 'menu' | 'dispatch'
    });
  }, ['components', 'organisms', 'smart-list']);

  readonly config = SmartListOrganismStore.Config.inject();
  readonly items = input<T[]>([]);
  readonly itemActions = input<Actions>([]);
  readonly groupedBy = input<string>();
  readonly groupKeys = input<string[]>();
  readonly itemActionsType = input(_computed(() => this.config().itemActionsType));
}

@Component({
  selector: 'organisms-smart-list',
  standalone: true,
  imports: [
    NgTemplateOutlet,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    MatRippleModule,
    DataAccessorPipe,
    ActionsPipe,
    GroupedByPipe,
    KeysPipe,
    SmartMenuButtonAtom
  ],
  template: `
  @if (store.groupedBy()) {
    <mat-list>
      @for (key of store.groupKeys() ?? (store.items() | groupedBy:store.groupedBy() | keys); track key) {
        <div mat-subheader>{{ key }}</div>
        @for (item of ((store.items() ?? [] | groupedBy:store.groupedBy())?.[key] ?? []); track item.id) { 
          <ng-container *ngTemplateOutlet="listItem; context: {$implicit: item}" />
          <mat-divider />
        }
      }
    </mat-list>
  } @else {
    <mat-list>
      @for (item of store.items(); track item.id) {
        <ng-container *ngTemplateOutlet="listItem; context: {$implicit: item}" />
        <mat-divider />
      }
    </mat-list>
  }
  <ng-template #listItem let-item>
    <mat-list-item lines="2" matRipple (click)="onItemClick(item)">
      <span
        matListItemTitle
        [matTooltip]="item | dataAccessor:'title'"
      >
        {{ item | dataAccessor:'title' }}
      </span>
      <span matListItemLine>
        {{ item | dataAccessor:'description' }}
      </span>
      @if ((store.itemActions() | resolveActions:item); as actions) {
        <ng-container matListItemMeta>
          @if (actions.length) {
            @switch (store.itemActionsType()) {
              @case ('dispatch') {
                <button
                  mat-icon-button
                  (click)="onItemActionsClick(item, $event)"
                >
                  <mat-icon>menu</mat-icon>
                </button>
              }
              @case ('menu') {
                <atoms-smart-menu-button
                  [actions]="actions"
                  (action)="dispatch($event)"
                />
              }
            }
          }
        </ng-container>
      }
    </mat-list-item>
  </ng-template>
  `,
  styleUrls: ['./smart-list.organism.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  hostDirectives: [
    {
      directive: SmartListOrganismStore,
      inputs: ['items', 'itemActions', 'groupedBy', 'groupKeys', 'itemActionsType'],
    },
  ],
})
export class SmartListOrganism<T> extends NgAtomicComponent {
  static readonly ActionId = ActionId;
  protected readonly store = inject(SmartListOrganismStore);
  protected readonly dataAccessor = inject(DATA_ACCESSOR, {optional: true}) ?? defaultDataAccessor;
  protected readonly trackById = (_: number, item: T) => this.dataAccessor(item, 'id');

  protected onItemClick(item: T) {
    this.dispatch({id: ActionId.CLICK_ITEM, payload: item});
  }

  protected onItemActionsClick(item: T, $event: Event) {
    $event.stopPropagation();
    $event.preventDefault();
    this.dispatch({id: ActionId.ITEM_BUTTON_CLICK, payload: item});
  }
}
