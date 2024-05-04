import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, Pipe, PipeTransform, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { DomainPipe } from '@ng-atomic/common/pipes/domain';
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
import { get } from 'lodash-es';

@Pipe({name: 'resolveColumns', standalone: true, pure: true})
export class ResolveColumnsPipe implements PipeTransform {
  transform(columns: string[]): {type: 'key' | 'actions' | 'checkbox', name: string, payload?: any}[] {
    const data = columns.map((column, i) => {
      if (typeof column === 'string') {
        if (column === '__checkbox') return {type: 'checkbox', name: `__checkbox_${i}`};
        if (column === '__actions') return {type: 'actions', name: `__actions_${i}`};
        return {type: 'key', name: column};
      }
      return {type: 'actions', name: `__actions_${i}`, payload: column};
    });
    return data as any;
  }
}

@Pipe({name: 'get', standalone: true, pure: true})
export class GetPipe<T> implements PipeTransform {
  transform(itemOrItems: T | T[], path: string): any | any[] {
    if (Array.isArray(itemOrItems)) return itemOrItems.map(item => get(item, path));
    return get(itemOrItems, path);
  }
}

@Component({
  selector: 'organisms-smart-table',
  standalone: true,
  imports: [
    CommonModule,
    DomainPipe,
    MatTableModule,
    MatCheckboxModule,
    MatMenuModule,
    MatButtonModule,
    MatIconModule,
    ActionsColumnMolecule,
    CheckboxColumnMolecule,
    SmartColumnMolecule,
    TreeColumnMolecule,
    ResolveColumnsPipe,
    GetPipe,
  ],
  template: `
  <table mat-table [dataSource]="dataSource" matSort matSortDisableClear matSortDirection="desc">
    <ng-container
      *ngFor="let column of (columns | resolveColumns); trackBy: trackByColumnName; let i = index"
      [ngSwitch]="column.type"
    >
      <molecules-checkbox-column
        *ngSwitchCase="'checkbox'"
        name="__checkbox"
        [selection]="selection"
        (checkboxClick)="checkboxClick.emit($event)"
      ></molecules-checkbox-column>
      <molecules-actions-column 
        *ngSwitchCase="'actions'" 
        [name]="column.name"
        [itemActions]="column?.payload || itemActions"
        (action)="action.emit($event)"
      ></molecules-actions-column>
      <ng-container *ngSwitchDefault>
        <molecules-tree-column
          *ngIf="column.name.startsWith('__tree_')"
          [name]="column.name"
          [headerText]="column.name | domain"
          [sort]="form.value.key === column.payload ? form.value.order : 'none'"
          [treeControl]="treeControl"
          (headerClick)="headerClick.emit(column.payload)"
        ></molecules-tree-column>
        <molecules-smart-column
          *ngIf="!column.name.startsWith('__tree_')"
          [name]="column.name"
          [headerText]="column.name | domain"
          [sort]="form.value.key === column.payload ? form.value.order : 'none'"
          (headerClick)="headerClick.emit(column.payload)"
        ></molecules-smart-column>
      </ng-container>
    </ng-container>
    <tr mat-header-row *matHeaderRowDef="(columns | resolveColumns | get:'name'); sticky: true"></tr>
    <tr mat-row *matRowDef="let item; columns: (columns | resolveColumns | get:'name');"></tr>
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
