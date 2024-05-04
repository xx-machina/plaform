import { CdkCellDef, CdkColumnDef, CdkHeaderCellDef, CdkTable, TextColumnOptions, TEXT_COLUMN_OPTIONS } from '@angular/cdk/table';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Inject, Input, Optional, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTableModule } from '@angular/material/table';
import { Action } from '@ng-atomic/common/models';
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
  ],
  templateUrl: './actions-column.molecule.html',
  styleUrls: ['./actions-column.molecule.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.Default,
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
  itemActions: (item: T) => Action[] = () => [];

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
