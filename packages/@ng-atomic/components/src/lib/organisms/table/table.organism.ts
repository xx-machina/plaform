import { ChangeDetectionStrategy, Component, Directive, Pipe, PipeTransform, computed, effect, inject, input } from '@angular/core';
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
import { get } from 'lodash-es';
import { flattenExcludeDayjs } from '@nx-ddd/core/util/walk-obj';
import { IndexTemplateFormBuilder } from './index.helpers';
import { Column, Sort } from '@ng-atomic/common/models';
import { computedRawValue } from '@ng-atomic/common/utils';
import { NgClass } from '@angular/common';

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

@Pipe({name: 'map', standalone: true, pure: true})
export class MapPipe<T> implements PipeTransform {
  transform(itemOrItems: T | T[], path: string): any | any[] {
    if (Array.isArray(itemOrItems)) return itemOrItems.map(item => get(item, path));
    return get(itemOrItems, path);
  }
}

@Pipe({name: 'autoColumns', standalone: true, pure: true})
export class AutoColumnsPipe<T> implements PipeTransform {
  transform(items: T[]): string[] {
    const keys = new Set<string>();
    items.slice(0, 1).forEach(item => {
      const obj = flattenExcludeDayjs(item);
      Object.keys(obj).forEach(key => keys.add(key));
    })
    return [...keys, '__actions'];
  }
}

@Pipe({name: 'sort', standalone: true, pure: true})
export class SortPipe implements PipeTransform {
  transform<T>(column: Column, sort: Sort): 'asc' | 'desc' | 'none' {
    return sort.key === column.name ? sort.order : 'none';
  }
}

@Pipe({name: 'columns', standalone: true, pure: true})
export class ColumnsPipe implements PipeTransform {
  transform<T>(columns: Column[]): Column[] {
    return columns.filter(item => item.visible).map((column, i) => ({
      ...column,
      name: ['checkbox', 'actions'].includes(column.type) ? `${column.name}_${i}` : column.name,
    }));
  }
}

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
  readonly childrenKey = input('children');
  readonly items = input<T[]>([]);
  readonly dataSource = computed(() => new MatTableDataSource<T>(this.items()));

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
