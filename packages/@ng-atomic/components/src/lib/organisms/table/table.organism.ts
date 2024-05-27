import { ChangeDetectionStrategy, Component, Directive, computed, effect, inject, input } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { DomainPipe } from '@ng-atomic/common/pipes/domain';
import { ActionsColumnMolecule } from '@ng-atomic/components/molecules/actions-column';
import { CheckboxColumnMolecule } from '@ng-atomic/components/molecules/checkbox-column';
import { SmartColumnMolecule } from '@ng-atomic/components/molecules/smart-column';
import { Actions, Effect, InjectableComponent, NgAtomicComponent, TokenizedType } from '@ng-atomic/core';
import { SelectionModel } from '@angular/cdk/collections';
import { TreeColumnMolecule } from '@ng-atomic/components/molecules/tree-column';
import { IndexTemplateFormBuilder } from './index.helpers';
import { Column } from '@ng-atomic/common/models';
import { computedRawValue } from '@ng-atomic/common/utils';
import { NgClass } from '@angular/common';
import { ColumnsPipe } from '@ng-atomic/common/pipes/columns';
import { ResolveColumnsPipe } from '@ng-atomic/common/pipes/resolve-columns';
import { MapPipe } from '@ng-atomic/common/pipes/map';
import { AutoColumnsPipe } from '@ng-atomic/common/pipes/auto-columns';
import { SortPipe } from '@ng-atomic/common/pipes/sort';
import { buildTreeFlatDataSource } from './table.helpers';
import { FlatTreeControl } from '@angular/cdk/tree';

@TokenizedType()
@Directive({
  standalone: true,
  selector: 'organisms-table',
  providers: [DomainPipe],
})
export class TableOrganismStore<T> extends InjectableComponent {
  readonly domainPipe = inject(DomainPipe);
  readonly form = input(inject(IndexTemplateFormBuilder).build());
  readonly itemActions = input<Actions>([]);
  readonly selection = input(new SelectionModel<string>(true, []));
  readonly highlight = input(new SelectionModel<string>(true, [])); 
  readonly childrenKey = input<string>(null);
  readonly items = input<T[]>([]);
  readonly treeControl = input(new FlatTreeControl<any>(n => n.level, n => n.isExpandable));
  readonly dataSource = computed(() => {
    if (this.childrenKey()) {
      return buildTreeFlatDataSource(this.treeControl(), this.items(), this.childrenKey());
    }
    return new MatTableDataSource<T>(this.items());
  });
  readonly isHidden = computed(() => (item: T) => this.treeControl().getLevel(item) === 0);

  readonly formValue = computedRawValue(() => this.form());
  readonly sort = computed(() => this.formValue()?.sort ?? {key: '', order: 'asc'}, {
    equal: (a, b) => JSON.stringify(a) === JSON.stringify(b),
  });
  readonly columns = computed(() => {
    return new ColumnsPipe().transform((this.formValue()?.columns ?? []) as Column[]).map(column => {
      if (column.name.startsWith('__tree_')) {
        return {
          ...column,
          type: 'tree',
          sort: this.sort().key === column.name ? this.sort().order : 'none',
        };
      } else if (column.type === 'actions') {
        return {
          ...column,
          actions: column.actions ?? this.itemActions(),
          type: 'actions',
          sort: this.sort().key === column.name ? this.sort().order : 'none',
        }
      } else {
        return {
          ...column,
          headerText: this.domainPipe.transform(column?.name),
          sort: this.sort().key === column.name ? this.sort().order : 'none',
        };
      }
    });
  }, { equal: (a, b) => JSON.stringify(a) === JSON.stringify(b) });
  readonly columnNames = computed(() => this.columns().map(column => column.name), {
    equal: (a, b) => JSON.stringify(a) === JSON.stringify(b),
  });

  constructor() {
    super();
    effect(() => {
      console.debug('highlight', this.highlight());
    });
  }
}

enum ActionId {
  CHECKBOX_CLICK = '[@ng-atomic/components/organisms/checkbox-column] Checkbox Click',
  HEADER_CLICK = '[@ng-atomic/components/organisms/table] Header Click',
}

@Component({
  selector: 'organisms-table',
  standalone: true,
  imports: [
    NgClass,
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
    MapPipe,
    AutoColumnsPipe,
    SortPipe,
    ColumnsPipe,
  ],
  template: `
  <table
    mat-table
    recycleRows
    matSort
    matSortDisableClear
    matSortDirection="desc"
    [dataSource]="store.dataSource()"
  >
    @for (column of store.columns(); track column.name; let i = $index) {
      @switch (column.type) {
        @case ('checkbox') {
          <molecules-checkbox-column
            [name]="column.name"
            [selection]="store.selection()"
            [isHidden]="store.isHidden()"
            (action)="dispatch($event)"
          />
        }
        @case ('actions') {
          <molecules-actions-column
            [name]="column.name"
            [itemActions]="column.actions"
            (action)="dispatch($event)"
          />
        }
        @case('tree') {
          <molecules-tree-column
            [name]="column.name"
            [headerText]="column.headerText"
            [treeControl]="store.treeControl()"
            [sort]="column.sort"
            (headerClick)="onHeaderClick(column.name)"
          />
        }
        @default {
          <molecules-smart-column
            [name]="column.name"
            [headerText]="column.headerText"
            [sort]="column.sort"
            (headerClick)="onHeaderClick(column.name)"
          />
        }
      }
    }
    <tr mat-header-row *matHeaderRowDef="store.columnNames(); sticky: true"></tr>
    <tr
      mat-row
      *matRowDef="let item; columns: store.columnNames();"
      [ngClass]="{ highlight: store.highlight().isSelected(item.id) }"
    ></tr>
    <div class="mat-row" *matNoDataRow>No Data</div>
  </table>
  `,
  styleUrls: ['./table.organism.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  hostDirectives: [
    {
      directive: TableOrganismStore,
      inputs: ['form', 'itemActions', 'selection', 'items', 'childrenKey', 'highlight'],
    },
  ],
  host: {class: 'organism'},
})
export class TableOrganism<Item extends object> extends NgAtomicComponent {
  static readonly ActionId = ActionId;
  protected store = inject(TableOrganismStore);

  @Effect(CheckboxColumnMolecule.ActionId.CHECKBOX_CLICK)
  protected onCheckboxClick(item: Item) {
    this.dispatch({id: ActionId.CHECKBOX_CLICK, payload: item});
  }

  protected onHeaderClick(column: string) {
    this.dispatch({id: ActionId.HEADER_CLICK, payload: column});
  }
}
