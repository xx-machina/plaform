import { ChangeDetectionStrategy, Component, Directive, EventEmitter, Injectable, Input, NgModule, Output, Pipe, PipeTransform, inject } from '@angular/core';
import { LegacyPageEvent as PageEvent } from '@angular/material/legacy-paginator';
import { CommonModule } from '@angular/common';
import { AutoLayoutFrame } from '@ng-atomic/components/frames/auto-layout';
import { ScrollFrame } from '@ng-atomic/components/frames/scroll';
import { HeaderMolecule } from '@ng-atomic/components/molecules/header';
import { SmartTableOrganism } from '@ng-atomic/components/organisms/smart-table';
import { SmartListOrganism } from '@ng-atomic/components/organisms/smart-list';
import { NavigatorOrganism } from '@ng-atomic/components/organisms/navigator';
import { PaginatorOrganism } from '@ng-atomic/components/organisms/paginator';
import { Action, Actions } from '@ng-atomic/core';
import { FormBuilder } from '@angular/forms';
import { GridToolbarOrganism } from '@ng-atomic/components/organisms/grid-toolbar';
import { FiltersSectionOrganism } from '@ng-atomic/components/organisms/filters-section';
import { DividerFrame } from '@ng-atomic/components/frames/divider';
import { SelectionModel } from '@angular/cdk/collections';
import { SelectionListOrganism } from '@ng-atomic/components/organisms/selection-list';
import { Effect, NgAtomicComponent } from '@ng-atomic/core';
import { SortService } from '@ng-atomic/common/services/form/sort';
import { PaginationService } from '@ng-atomic/common/services/form/pagination';
import { QueryPipe } from '@ng-atomic/common/pipes/query';
import { QueryResolverService } from '@ng-atomic/common/services/query-resolver';
import { flattenExcludeDayjs } from '@nx-ddd/core/util/walk-obj';
import { injectUiConfig } from '@ng-atomic/common/services/ui';
import { signalize } from '@ng-atomic/common/pipes/signal';

export enum ActionId {
  BACK = '[@ng-atomic/components/templates/smart-index] Back',
  TABLE_HEADER_CLICK = '[@ng-atomic/components/templates/smart-index] Table Header Click',
  ITEM_CLICK = '[@ng-atomic/components/templates/smart-index] Item Click',
  LIST_ITEM_BUTTON_CLICKED = '[@ng-atomic/components/templates/smart-index] List Item Button Clicked',
  CHECKBOX_CLICK = '[@ng-atomic/components/templates/smart-index] Check Item',
}

@Injectable({ providedIn: 'root' })
export class SmartIndexTemplateFormBuilder extends FormBuilder {
  sort = inject(SortService);
  query = inject(PaginationService)

  build({
    query = '',
    sort = {}
  }: {query?: string, sort?: {}} = {}) {
    return this.group({
      query: this.control(query),
      page: this.query.build(),
      sort: this.sort.build(),
    })
  }
}

@Pipe({name: 'page', standalone: true, pure: true})
export class PagePipe<T> implements PipeTransform {
  transform(items: T[], value): T[] {
    const start = value?.pageIndex * value?.pageSize;
    const end = start + value?.pageSize;
    return items.slice(start, end);
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

@Directive({ standalone: true })
export class SmartIndexTemplateStore<T> {
  @Input()
  gridToolbarActions: Action[] = [];

  @Input()
  tableChildrenKey: string = '';

  @Input()
  form = inject(SmartIndexTemplateFormBuilder).build();

  @Input()
  title: string = '';

  @Input()
  description?: string;

  @Input()
  items: T[] = [];

  @Input()
  itemActions: Actions = [];

  @Input()
  navStartActions: Actions = [{ id: ActionId.BACK, icon: 'arrow_back' }];

  @Input()
  navEndActions: Actions = [];

  @Input() groupedBy: keyof T;
  @Input() groupKeys: string[];

  @Input()
  columns: (keyof T | Actions)[];

  /**
   * @deprecated use columns instead.
   */
  @Input('properties')
  set properties(value: (keyof T)[]) {
    console.warn('properties is deprecated. use columns instead.')
    this.columns = value;
  }

  @Input()
  selection: SelectionModel<string> = new SelectionModel();

  @Input()
  pageSizeOptions: number[] = [5, 10, 25, 100];

  @Input()
  queryPlaceholder = '';

  @Input()
  device: 'sp' | 'tablet' | 'pc' = 'sp';

  @Input({transform: (value: any) => signalize(value)})
  type = injectUiConfig(['templates', 'index', 'type']);

  @Output()
  pageChange = new EventEmitter<PageEvent>();
}

@Pipe({standalone: true, name: 'count', pure: true})
export class SmartIndexCountPipe implements PipeTransform {
  store = inject(SmartIndexTemplateStore);

  transform(items: any[]) {
    this.store.form.get(['page']).patchValue({length: items.length});
    return items;
  }
}

@Component({
  standalone: true,
  imports: [
    CommonModule,
    AutoLayoutFrame,
    ScrollFrame,
    DividerFrame,
    GridToolbarOrganism,
    PaginatorOrganism,
    SmartTableOrganism,
    SmartListOrganism,
    SelectionListOrganism,
    NavigatorOrganism,
    FiltersSectionOrganism,
    HeaderMolecule,
    PagePipe,
    QueryPipe,
    SmartIndexCountPipe,
    AutoColumnsPipe,
  ],
  providers: [
    QueryResolverService,
  ],
  selector: 'templates-smart-index',
  template: `
  <frames-scroll>
    <organisms-navigator
      [startActions]="store.navStartActions"
      [endActions]="store.navEndActions"
      (action)="dispatch($event)"
      navigator
    >
      <molecules-header [title]="store.title" [description]="store.description"></molecules-header>
    </organisms-navigator>
    <frames-auto-layout vertical contents [ngSwitch]="store.type()">
      <ng-container *ngSwitchCase="'list'">
        <organisms-smart-list
          [items]="store.items"
          [itemActions]="store.itemActions"
          [groupedBy]="store.groupedBy"
          [groupKeys]="store.groupKeys"
          (action)="dispatch($event)"
        ></organisms-smart-list>
        <!-- <organisms-selection-list
          [items]="items"
          (action)="dispatch($event)"
        ></organisms-selection-list> -->
      </ng-container>
      <ng-container *ngSwitchDefault>
        <frames-divider>
          <ng-content first select="[dashboard]"></ng-content>
          <div style="display: flex; flex-direction: column; width: 100%; height: 100%;" second>
            <organisms-grid-toolbar
              *ngIf="store.gridToolbarActions || true"
              [actions]="store.gridToolbarActions"
              [control]="store.form.get(['query'])"
              (action)="dispatch($event)"
            ></organisms-grid-toolbar>
            <organisms-smart-table
              [items]="store.items 
                | query: store.form.get(['query']).value 
                | count 
                | page: store.form.get(['page']).value
              "
              [itemActions]="store.itemActions"
              [columns]="store.columns ?? (store.items | autoColumns)"
              [selection]="store.selection"
              [form]="store.form.get(['sort'])"
              [childrenKey]="store.tableChildrenKey"
              (action)="dispatch($event)"
              (checkboxClick)="onCheckboxClickItem($event)"
              (headerClick)="dispatch({id: ActionId.TABLE_HEADER_CLICK, payload: $event})"
            ></organisms-smart-table>
            <organisms-paginator
              *ngIf="store.form.get(['page'])"
              [form]="store.form.get(['page'])"
              [pageSizeOptions]="store.pageSizeOptions"
              [placeholder]="store.queryPlaceholder"
            ></organisms-paginator>
          </div>
        </frames-divider>
      </ng-container>
    </frames-auto-layout>
  </frames-scroll>
  `,
  styleUrls: ['./smart-index.template.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'template' },
  hostDirectives: [
    {
      directive: SmartIndexTemplateStore,
      inputs: [
        'gridToolbarActions', 'tableChildrenKey', 'form', 'title',
        'description', 'items', 'itemActions', 'navStartActions',
        'navEndActions', 'groupedBy', 'groupKeys', 'columns',
        'selection', 'pageSizeOptions', 'queryPlaceholder', 'device',
        'type'
      ],
      outputs: [],
    }
  ],
})
export class SmartIndexTemplate<T> extends NgAtomicComponent {
  static ActionId = ActionId;
  protected ActionId = ActionId;
  protected store = inject(SmartIndexTemplateStore);

  protected onCheckboxClickItem(item: T) {
    this.dispatch({id: ActionId.CHECKBOX_CLICK, payload: item});
  }

  @Effect(SmartListOrganism.ActionId.CLICK_ITEM)
  protected onItemClicked(item: T) {
    this.dispatch({id: ActionId.ITEM_CLICK, payload: item});
  }

  @Effect(SmartListOrganism.ActionId.ITEM_BUTTON_CLICK)
  protected onItemButtonClicked(item: T) {
    this.dispatch({id: ActionId.LIST_ITEM_BUTTON_CLICKED, payload: item});
  }
}
