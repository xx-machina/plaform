import { ChangeDetectionStrategy, Component, Directive, Input, inject } from '@angular/core';
import { DATA_ACCESSOR, defaultDataAccessor } from '@ng-atomic/common/pipes/data-accessor';
import { CommonModule } from '@angular/common';
import { MatListModule } from '@angular/material/list';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatIconModule } from '@angular/material/icon';
import { MatRippleModule } from '@angular/material/core';
import { DataAccessorPipe } from '@ng-atomic/common/pipes/data-accessor';
import { Actions, NgAtomicComponent } from '@ng-atomic/core';
import { KeysPipe } from '@ng-atomic/common/pipes/keys';
import { GroupedByPipe } from '@ng-atomic/common/pipes/grouped-by';
import { MatButtonModule } from '@angular/material/button';
import { ActionsPipe } from '@ng-atomic/common/pipes/actions';

export enum ActionId {
  CLICK_ITEM = '[@ng-atomic/components/organisms/smart-list] Click Item',
  ITEM_BUTTON_CLICK = '[@ng-atomic/components/organisms/smart-list] Item Button Click',
}

@Directive({standalone: true})
export class SmartListOrganismStore {
  @Input() items: any[] = [];
  @Input() itemActions: Actions = [];
  @Input() groupedBy: string;
  @Input() groupKeys: string[];
}

@Component({
  selector: 'organisms-smart-list',
  standalone: true,
  imports: [
    CommonModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    MatRippleModule,
    DataAccessorPipe,
    ActionsPipe,
    GroupedByPipe,
    KeysPipe,
  ],
  template: `
    <mat-list *ngIf="store.groupedBy">
      <ng-container *ngFor="let key of store.groupKeys ?? (store.items | groupedBy:store.groupedBy | keys); trackBy: trackByItem;">
        <div mat-subheader>{{ key }}</div>
        <ng-container *ngFor="let item of (store.items | groupedBy:store.groupedBy)[key]; trackBy: trackById">
          <ng-container *ngTemplateOutlet="listItem; context: {$implicit: item}"></ng-container>
        </ng-container>
        <mat-divider></mat-divider>
      </ng-container>
    </mat-list>
    <mat-list *ngIf="!store.groupedBy">
      <ng-container *ngFor="let item of store.items; trackBy: trackById">
        <ng-container *ngTemplateOutlet="listItem; context: {$implicit: item}"></ng-container>
        <mat-divider></mat-divider>
      </ng-container>
    </mat-list>

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
        <ng-container *ngIf="(store.itemActions | resolveActions:item) as actions" matListItemMeta>
          <button
            *ngIf="actions.length"
            mat-icon-button
            (click)="onItemActionsClick(item, $event)"
          >
            <mat-icon>menu</mat-icon>
          </button>
        </ng-container>
      </mat-list-item>
    </ng-template>
  `,
  styleUrls: ['./smart-list.organism.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  hostDirectives: [
    {
      directive: SmartListOrganismStore,
      inputs: ['items', 'itemActions', 'groupedBy', 'groupKeys'],
    },
  ],
})
export class SmartListOrganism<T> extends NgAtomicComponent {
  static readonly ActionId = ActionId;
  protected readonly store = inject(SmartListOrganismStore);
  protected readonly dataAccessor = inject(DATA_ACCESSOR) ?? defaultDataAccessor;
  protected readonly trackByItem = (_: number, item: T) => item;
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
