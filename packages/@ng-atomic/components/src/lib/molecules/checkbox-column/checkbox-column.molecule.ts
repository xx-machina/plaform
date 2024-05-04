import { CdkCellDef, CdkColumnDef, CdkHeaderCellDef, CdkTable } from '@angular/cdk/table';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Optional, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { MAT_CHECKBOX_DEFAULT_OPTIONS, MatCheckboxDefaultOptions, MatCheckboxModule } from '@angular/material/checkbox';
import { MatTableModule } from '@angular/material/table';
import { SelectIdPipe } from '@ng-atomic/common/pipes/select-id';

@Component({
  selector: 'molecules-checkbox-column',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatCheckboxModule,
    SelectIdPipe,
  ],
  providers: [
    {provide: MAT_CHECKBOX_DEFAULT_OPTIONS, useValue: { clickAction: 'noop' } as MatCheckboxDefaultOptions}
  ],
  templateUrl: './checkbox-column.molecule.html',
  styleUrls: ['./checkbox-column.molecule.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CheckboxColumnMolecule<T> implements OnInit {

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
  selectedIdSet = new Set<string>();

  @Output()
  checkboxClick = new EventEmitter<T>();

  @ViewChild(CdkColumnDef, {static: true})
  columnDef!: CdkColumnDef;

  @ViewChild(CdkCellDef, {static: true})
  cell!: CdkCellDef;

  @ViewChild(CdkHeaderCellDef, {static: true})
  headerCell!: CdkHeaderCellDef;

  constructor(@Optional() private _table: CdkTable<T>) { }

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
