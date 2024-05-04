import { ChangeDetectionStrategy, Component, Directive, Input, inject } from '@angular/core';
import { DATA_ACCESSOR, defaultDataAccessor } from '@ng-atomic/common/pipes/data-accessor';
import { CommonModule } from '@angular/common';
import { MatListModule } from '@angular/material/list';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatIconModule } from '@angular/material/icon';
import { MatRippleModule } from '@angular/material/core';
import { DataAccessorPipe } from '@ng-atomic/common/pipes/data-accessor';
import { NgAtomicComponent } from '@ng-atomic/common/stores/component-store';
import { KeysPipe } from '@ng-atomic/common/pipes/keys';
import { GroupedByPipe } from '@ng-atomic/common/pipes/grouped-by';

export enum ActionId {
  CLICK_ITEM = '[@ng-atomic/components/organisms/smart-list] Click Item',
}

@Directive({standalone: true})
export class SmartListOrganismStore {
  @Input() items: any[] = [];
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
    MatTooltipModule,
    MatRippleModule,
    DataAccessorPipe,
    GroupedByPipe,
    KeysPipe,
  ],
  template: `
    <mat-list *ngIf="store.groupedBy">
      <ng-container *ngFor="let key of store.groupKeys ?? (store.items | groupedBy:store.groupedBy | keys); trackBy: trackByItem;">
        <div mat-subheader>{{ key }}</div>
        <ng-container *ngFor="let item of (store.items | groupedBy:store.groupedBy)[key]; trackBy: trackById">
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
          </mat-list-item>
        </ng-container>
        <mat-divider></mat-divider>
      </ng-container>
    </mat-list>
    <mat-list *ngIf="!store.groupedBy">
      <ng-container *ngFor="let item of store.items; trackBy: trackById">
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
        </mat-list-item>
        <mat-divider></mat-divider>
      </ng-container>
    </mat-list>
  `,
  styleUrls: ['./smart-list.organism.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  hostDirectives: [
    {
      directive: SmartListOrganismStore,
      inputs: ['items', 'groupedBy', 'groupKeys'],
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
}
