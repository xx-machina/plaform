import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { DomainModule } from '@ng-atomic/common/pipes/domain';
import { ActionsColumnMolecule } from '@ng-atomic/components/molecules/actions-column';
import { CheckboxColumnMolecule } from '@ng-atomic/components/molecules/checkbox-column';
import { SmartColumnMolecule } from '@ng-atomic/components/molecules/smart-column';
import { Actions, Action } from '@ng-atomic/common/models';
import { SortService } from '@ng-atomic/common/services/form/sort';
import { FlatTreeControl } from '@angular/cdk/tree';
import {
  MatTreeFlatDataSource,
  MatTreeFlattener,
} from '@angular/material/tree';
import { DataSource, SelectionModel } from '@angular/cdk/collections';
import { TreeColumnMolecule } from '@ng-atomic/components/molecules/tree-column';


@Component({
  selector: 'organisms-smart-table',
  standalone: true,
  imports: [
    CommonModule,
    DomainModule,
    MatTableModule,
    MatCheckboxModule,
    MatMenuModule,
    MatButtonModule,
    MatIconModule,
    ActionsColumnMolecule,
    CheckboxColumnMolecule,
    SmartColumnMolecule,
    TreeColumnMolecule,
  ],
  template: `
  <table mat-table [dataSource]="dataSource" matSort matSortDisableClear matSortDirection="desc">
    <ng-container *ngFor="let name of columns; trackBy: trackByColumnName" [ngSwitch]="name">
      <molecules-checkbox-column
        *ngSwitchCase="'__checkbox'"
        name="__checkbox"
        [selection]="selection"
        (checkboxClick)="checkboxClick.emit($event)"
      ></molecules-checkbox-column>
      <molecules-actions-column 
        *ngSwitchCase="'__actions'" 
        name="__actions"
        [itemActions]="itemActions"
        (action)="action.emit($event)"
      ></molecules-actions-column>
      <ng-container *ngSwitchDefault>
        <molecules-tree-column
          *ngIf="name.startsWith('__tree_')"
          [name]="name"
          [headerText]="name | D"
          [sort]="form.value.key === name ? form.value.order : 'none'"
          [treeControl]="treeControl"
          (headerClick)="headerClick.emit(name)"
        ></molecules-tree-column>
        <molecules-smart-column
          *ngIf="!name.startsWith('__tree_')"
          [name]="name"
          [headerText]="name | D"
          [sort]="form.value.key === name ? form.value.order : 'none'"
          (headerClick)="headerClick.emit(name)"
        ></molecules-smart-column>
      </ng-container>
    </ng-container>
    <tr mat-header-row *matHeaderRowDef="columns; sticky: true"></tr>
    <tr mat-row *matRowDef="let item; columns: columns;"></tr>
    <div class="mat-row" *matNoDataRow>No Data</div>
  </table>
  `,
  styleUrls: ['./smart-table.organism.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {class: 'organism'}
})
export class SmartTableOrganism<Item extends object> {
  #form = inject(SortService);
  protected dataSource: DataSource<Item>;

  @Input('columns')
  _columns: (keyof Item)[] = [];

  get columns(): (keyof Item | string)[] {
    return [...this._columns];
  }

  @Input()
  childrenKey = 'children';

  @Input()
  set items(items: Item[]) {
    this.dataSource = this.buildTreeFlatDatasource(items, this.childrenKey);
  }

  @Input()
  itemActions: Actions = [];

  @Input()
  selection = new SelectionModel<string>(true, []);

  @Input()
  form = this.#form.build();

  @Output()
  action = new EventEmitter<Action>();

  @Output()
  headerClick = new EventEmitter<string>();
  
  @Output()
  checkboxClick = new EventEmitter<[Item, boolean]>();

  @Output()
  pageChange = new EventEmitter();

  @Output()
  itemCheck = new EventEmitter<[Item, boolean]>();
  
  protected trackByColumnName = (columnName: string) => columnName;

  protected treeControl = new FlatTreeControl<any>(
    (node) => node.level,
    (node) => node.isExpandable
  );

  buildTreeFlatDatasource<T = any>(data: T[], key = 'children') {
    const treeFlattener = new MatTreeFlattener(
      (node: any, level: number) => ({
        ...node,
        isExpandable: (node[key] ?? []).length > 0,
        level,
      }),
      (node) => node.level,
      (node) => node.isExpandable,
      (node) => node[key]
    );
    
    return new MatTreeFlatDataSource(this.treeControl, treeFlattener, data);
  }
}
