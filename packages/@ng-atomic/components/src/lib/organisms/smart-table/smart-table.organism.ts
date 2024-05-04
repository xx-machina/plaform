import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
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

import { FlatTreeControl } from '@angular/cdk/tree';
import {
  MatTreeFlatDataSource,
  MatTreeFlattener,
} from '@angular/material/tree';
import { DataSource } from '@angular/cdk/collections';
import { TreeColumnMolecule } from '@ng-atomic/components/molecules/tree-column';

interface Sort {
  key?: string;
  order?: 'desc' | 'asc';
}

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
  templateUrl: './smart-table.organism.html',
  styleUrls: ['./smart-table.organism.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {class: 'organism'}
})
export class SmartTableOrganism<Item extends object> {

  protected dataSource: DataSource<Item>;

  @Input('columns')
  _columns: (keyof Item)[] = [];

  get columns(): (keyof Item | string)[] {
    return [...this._columns];
  }

  @Input()
  childrenKey = 'children';

  @Input()
  // items: Item[] = [];
  set items(items: Item[]) {
    this.dataSource = this.buildTreeFlatDatasource(items, this.childrenKey);
  }

  @Input()
  itemActions: Actions = () => [];

  @Input()
  pageSize: number = 0;

  @Input()
  selectedIdSet = new Set<string>();

  @Input()
  sort: Sort = {};

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
