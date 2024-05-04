import { ChangeDetectionStrategy, Component, Input, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatListModule, MatSelectionList } from '@angular/material/list';
import { DataAccessorPipe } from '@ng-atomic/common/pipes/data-accessor';
import { SelectionModel } from '@angular/cdk/collections';
import { NgAtomicComponent } from '@ng-atomic/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { SmartMenuButtonAtom } from '@ng-atomic/components/atoms/smart-menu-button';
import { Action } from '@ng-atomic/core';

enum ActionId {
  TOGGLE_OPTION = '[@ng-atomic/components/organisms/selection-list] Toggle Option',
}

@Component({
  selector: 'organisms-selection-list',
  standalone: true,
  imports: [
    CommonModule,
    MatListModule,
    DataAccessorPipe,
    MatIconModule,
    MatButtonModule,
    SmartMenuButtonAtom,
  ],
  template: `
    <mat-selection-list
      [multiple]="false"
    >
      <mat-list-option
        *ngFor="let item of items"
        [lines]="2" 
        [value]="item"
        [selected]="selection.isSelected(item.id)"
        [togglePosition]="'before'"
        (click)="toggleOption(item)"
      >
        <span
          matListItemTitle
          [matTooltip]="item | dataAccessor:'title'"
          >
          {{ item | dataAccessor:'title' }}
        </span>
        <span matListItemLine>
          {{ item | dataAccessor:'description' }}
        </span>
        <atoms-smart-menu-button
          style="margin-top: -16px;"
          matListItemAvatar
          [actions]="itemActions(item)"
          (action)="dispatch($event)"
          (click)="$event.preventDefault(); $event.stopPropagation();"
        ></atoms-smart-menu-button>
      </mat-list-option>
    </mat-selection-list>
  `,
  styleUrls: ['./selection-list.organism.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SelectionListOrganism<T> extends NgAtomicComponent {
  static ActionId = ActionId;

  @ViewChild(MatSelectionList, { static: true })
  list!: MatSelectionList

  @Input()
  items: T[] = [];

  @Input()
  itemActions: (item: T) => Action[] = () => [];

  @Input()
  selection = new SelectionModel(false);

  toggleOption(item: T) {
    this.dispatch({
      id: ActionId.TOGGLE_OPTION,
      payload: item,
    });
  }
}
