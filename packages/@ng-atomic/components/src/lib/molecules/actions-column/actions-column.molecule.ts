import { CdkCellDef, CdkColumnDef, CdkHeaderCellDef, CdkTable, TextColumnOptions, TEXT_COLUMN_OPTIONS } from '@angular/cdk/table';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Inject, Input, Optional, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTableModule } from '@angular/material/table';
import { Action, Actions } from '@ng-atomic/common/models';
import { ActionsPipe } from '@ng-atomic/common/pipes/actions';
import { SmartMenuButtonAtom } from '@ng-atomic/components/atoms/smart-menu-button';

@Component({
  selector: 'molecules-actions-column',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatMenuModule,
    MatButtonModule,
    MatIconModule,
    SmartMenuButtonAtom,
    ActionsPipe,
  ],
  template: `
  <ng-container matColumnDef>
    <th mat-header-cell *matHeaderCellDef>操作</th>
    <td mat-cell *matCellDef="let item">
      <atoms-smart-menu-button
        [actions]="itemActions | resolveActions: item"
        (action)="action.emit({id: $event.id, payload: item})"
      ></atoms-smart-menu-button>
    </td>
  </ng-container>
  `,
  styleUrls: ['./actions-column.molecule.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ActionsColumnMolecule<T> {
  @Input()
  get name(): string {
    return this._name;
  }
  set name(name: string) {
    this._name = name;
    this._syncColumnDefName();
  }
  _name!: string;

  @Input()
  itemActions: Actions = [];

  @Output()
  action = new EventEmitter<Action>();

  @ViewChild(CdkColumnDef, {static: true})
  columnDef!: CdkColumnDef;
  
  @ViewChild(CdkCellDef, {static: true})
  cell!: CdkCellDef;

  @ViewChild(CdkHeaderCellDef, {static: true})
  headerCell!: CdkHeaderCellDef;

  constructor(
    @Optional() private _table: CdkTable<T>,
    @Optional() @Inject(TEXT_COLUMN_OPTIONS) private _options: TextColumnOptions<T>,
  ) {
    this._options ??= {};
  }

  ngOnInit() {
    this._syncColumnDefName();

    if (this._table) {
      this.columnDef.cell = this.cell;
      this.columnDef.headerCell = this.headerCell;
      this._table.addColumnDef(this.columnDef);
    }
  }

  ngOnDestroy() {
    if (this._table) {
      this._table.removeColumnDef(this.columnDef);
    }
  }

  private _syncColumnDefName() {
    if (this.columnDef) {
      this.columnDef.name = this.name;
    }
  }
}