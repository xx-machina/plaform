import { ChangeDetectionStrategy, Component, EventEmitter, Inject, Input, Optional, Output } from '@angular/core';
import { Action } from '@ng-atomic/common/models';
import { DataAccessor, DATA_ACCESSOR, defaultDataAccessor } from '@ng-atomic/common/pipes/data-accessor';
import { CommonModule } from '@angular/common';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatRippleModule } from '@angular/material/core';
import { DataAccessorPipe } from '@ng-atomic/common/pipes/data-accessor';

export enum ActionId {
  CLICK_ITEM = '[@ng-atomic/components/organisms/smart-list] Click Item',
}

@Component({
  selector: 'organisms-smart-list',
  standalone: true,
  imports: [
    CommonModule,
    MatListModule,
    MatIconModule,
    MatRippleModule,
    DataAccessorPipe,
  ],
  template: `
    <mat-list>
      <ng-container *ngFor="let status of statuses">
        <div mat-subheader> {{ status }}</div>
        <ng-container *ngFor="let item of statusMap[status]">
          <mat-list-item lines="2" matRipple (click)="onItemClick(item)">
            <span matListItemTitle>{{ item | dataAccessor:'title' }}</span>
            <span matListItemLine>{{ item | dataAccessor:'description' }}</span>
          </mat-list-item>
          <mat-divider *ngIf="statuses.length === 1"></mat-divider>
        </ng-container>
        <mat-divider *ngIf="statuses.length > 1"></mat-divider>
      </ng-container>
    </mat-list>
  `,
  styleUrls: ['./smart-list.organism.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SmartListOrganism<T> {

  constructor(
    @Optional() @Inject(DATA_ACCESSOR) private dataAccessor: DataAccessor<T>
  ) {
    this.dataAccessor ??= defaultDataAccessor;
  }

  @Input()
  items: T[] = [];

  @Output()
  action = new EventEmitter<Action>();

  get statusMap() {
    return (this.items ?? []).reduce((acc, item) => {
      const key = this.dataAccessor(item, '__status');
      acc[key] ??= [],
      acc[key].push(item);
      return acc;
    }, {} as { [id: string]: any[] });
  }

  get statuses() {
    return Object.keys(this.statusMap);
  }

  protected onItemClick(item: T) {
    this.action.emit({
      id: ActionId.CLICK_ITEM,
      payload: item,
    });
  }
}
