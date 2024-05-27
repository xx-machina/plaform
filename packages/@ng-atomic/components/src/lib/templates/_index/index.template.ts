import { ChangeDetectionStrategy, Component, Directive, PLATFORM_ID, computed, inject, input, viewChild } from '@angular/core';
import { isPlatformServer } from '@angular/common';
import { AutoLayoutFrame } from '@ng-atomic/components/frames/auto-layout';
import { ScrollFrame } from '@ng-atomic/components/frames/scroll';
import { HeaderMoleculeStore } from '@ng-atomic/components/molecules/header';
import { TableOrganism, TableOrganismStore, injectIndexForm } from '@ng-atomic/components/organisms/table';
import { SmartListOrganism } from '@ng-atomic/components/organisms/smart-list';
import { NavigatorOrganismStore } from '@ng-atomic/components/organisms/navigator';
import { PaginatorOrganismStore } from '@ng-atomic/components/organisms/paginator';
import { Action, Actions, InjectableComponent, TokenizedType, _computed, computeFake } from '@ng-atomic/core';
import { GridToolbarOrganismStore } from '@ng-atomic/components/organisms/grid-toolbar';
import { FiltersSectionOrganism } from '@ng-atomic/components/organisms/filters-section';
import { DividerFrame } from '@ng-atomic/components/frames/divider';
import { SelectionModel } from '@angular/cdk/collections';
import { SelectionListOrganism } from '@ng-atomic/components/organisms/selection-list';
import { Effect, NgAtomicComponent } from '@ng-atomic/core';
import { QueryResolverService } from '@ng-atomic/common/services/query-resolver';
import { NavActionId, UIContext, call, injectNavStartActions, makeConfig } from '@ng-atomic/common/services/ui';
import { IndexPipe } from '@ng-atomic/common/pipes/index';
import { IndexLengthPipe } from '@ng-atomic/common/pipes/index-length';
import { SortByPipe } from '@ng-atomic/common/pipes/sort-by';
import { GridCardsSectionOrganism } from '@ng-atomic/components/organisms/grid-cards-section';
import { injectModelName } from '@ng-atomic/common/pipes/domain';
import { DataAccessorPipe } from '@ng-atomic/common/pipes/data-accessor';
import { FormGroup } from '@angular/forms';
import { computedRawValue } from '@ng-atomic/common/utils';
import { toObservable } from '@angular/core/rxjs-interop';
import { ChipsInputSectionOrganism } from '@ng-atomic/components/organisms/chips-input-section';

export enum ActionId {
  BACK = '[@ng-atomic/components/templates/index] Back',
  TABLE_HEADER_CLICK = '[@ng-atomic/components/templates/index] Table Header Click',
  ITEM_CLICK = '[@ng-atomic/components/templates/index] Item Click',
  DETAIL = '[@ng-atomic/components/templates/index] Detail',
  LIST_ITEM_BUTTON_CLICKED = '[@ng-atomic/components/templates/index] List Item Button Clicked',
  CHECKBOX_CLICK = '[@ng-atomic/components/templates/index] Check Item',
  TOGGLE_TYPE = '[@ng-atomic/components/templates/index] Toggle Type',
}

export interface IndexTemplateConfig<T extends {id: string} = any> {
  form: FormGroup;
  gridToolbarActions: Action[];
  navStartActions: Actions;
  navEndActions: Actions;
  itemActions: Actions;
  title: string;
  description: string;
  items: T[]
  tableChildrenKey: keyof T;
  groupedBy: keyof T | null;
  groupKeys: string[];
  type: 'list' | 'table' | 'grid';
  toggleActions: Actions;
  pageSizeOptions: number[];
  width: string;
  selection: SelectionModel<string>;
  highlight: SelectionModel<string>;
}


@TokenizedType()
@Directive({
  standalone: true,
  selector: 'templates-index',
  providers: [
    IndexPipe,
    IndexLengthPipe,
  ],
})
export class IndexTemplateStore<T extends {id: string}> extends InjectableComponent {
  static readonly Config = makeConfig(() => {
    const modelName = injectModelName();
    function getType(context: UIContext) {
      switch (context.breakpoint) {
        case 'xSmall': return 'list';
        case 'small': return 'table';
        case 'medium': return 'table';
        case 'large': return 'table';
        case 'xLarge': return 'table';
        default: return 'table';
      }
    }
  
    function getWidth(context: UIContext) {
      switch (context.breakpoint) {
        case 'xSmall': return 'var(--page-width-lv1)'
        case 'small':
        case 'medium':
        case 'large':
        case 'xLarge':
        default: return 'var(--page-width-lv2)';
      }
    }
    const form = injectIndexForm();
    const navStartActions = injectNavStartActions();
  
    return (_, context) => ({
      form,
      toggleActions: [
        { id: ActionId.TOGGLE_TYPE, icon: 'grid_view', payload: 'grid' },
        { id: ActionId.TOGGLE_TYPE, icon: 'list', payload: 'list' },
        { id: ActionId.TOGGLE_TYPE, icon: 'table', payload: 'table' },
      ] as Action[],
      gridToolbarActions: [] as Action[],
      tableChildrenKey: null as string,
      itemActions: (item) => [{id: ActionId.DETAIL, icon: 'open_in_new', payload: item}],
      items: [],
      title: `${modelName()}一覧`,
      description: ``,
      navStartActions: navStartActions(),
      navEndActions: [],
      groupedBy: null,
      groupKeys: [],
      type: getType(context),
      pageSizeOptions: [5, 10, 25, 100],
      width: getWidth(context),
      selection: new SelectionModel<string>(true, []),
      highlight: new SelectionModel<string>(true, []),
    });
  }, ['components', 'templates', 'index']);

  readonly config = IndexTemplateStore.Config.inject();
  readonly isPlatformServer = isPlatformServer(inject(PLATFORM_ID));
  readonly form = input(_computed(() => this.config().form));
  readonly gridToolbarActions = input(_computed(() => this.config().gridToolbarActions));
  readonly toggleActions = input(_computed(() => this.config().toggleActions));
  readonly tableChildrenKey = input(_computed(() => this.config().tableChildrenKey));
  readonly itemActions = input(_computed(() => this.config().itemActions));
  readonly title = input(_computed(() => this.config().title));
  readonly description = input(_computed(() => this.config().description));
  readonly items = input<T[]>(_computed(() => this.config().items));
  readonly navStartActions = input(_computed(() => this.config().navStartActions));
  readonly navEndActions = input(_computed(() => this.config().navEndActions));
  readonly groupedBy = input(_computed(() => this.config().groupedBy));
  readonly groupKeys = input(_computed(() => this.config().groupKeys));
  readonly pageSizeOptions = input(_computed(() => this.config().pageSizeOptions));
  readonly type = input(_computed(() => this.config().type));
  readonly selection = input(_computed(() => this.config().selection));
  readonly highlight = input(_computed(() => this.config().highlight));
  readonly form$ = toObservable(computeFake(this.form));
  readonly formValue = computedRawValue(() => call(this.form()));
  readonly pipes = { index: inject(IndexPipe), indexLength: inject(IndexLengthPipe)};
  readonly indexItems = computed(() => {
    return this.pipes.index.transform(this.items(), this.formValue() as any);
  });
  readonly indexItemsLength = computed(() => this.pipes.indexLength.transform(this.items(), this.formValue() as any));
}

@Component({
  standalone: true,
  imports: [
    DataAccessorPipe,
    AutoLayoutFrame,
    ChipsInputSectionOrganism,
    ScrollFrame,
    DividerFrame,
    GridToolbarOrganismStore,
    PaginatorOrganismStore,
    TableOrganismStore,
    SmartListOrganism,
    GridCardsSectionOrganism,
    SelectionListOrganism,
    NavigatorOrganismStore,
    FiltersSectionOrganism,
    HeaderMoleculeStore,
    SortByPipe,
  ],
  selector: 'templates-index',
  template: `
  <frames-scroll>
    <organisms-navigator injectable
      [startActions]="store.navStartActions()"
      [endActions]="store.navEndActions()"
      (action)="dispatch($event)"
      navigator
    >
      <molecules-header injectable [title]="store.title()" [description]="store.description()"/>
    </organisms-navigator>
    <frames-auto-layout vertical contents>
      @switch(store.type()) {
        @case('list') {
          <organisms-smart-list
            [items]="store.indexItems()"
            [itemActions]="store.itemActions()"
            [groupedBy]="store.groupedBy()"
            [groupKeys]="store.groupKeys()"
            (action)="dispatch($event)"
          />
        }
        @case ('grid') {
          @defer {
            <organisms-grid-cards-section
              [items]="store.indexItems()"
              (action)="dispatch($event)"
              contents
            />
          }
        }
        @default {
          @defer {
            <frames-divider>
              <ng-content first select="[dashboard]" />
              <div style="display: flex; flex-direction: column; width: 100%; height: 100%;" second>
              @if (store.gridToolbarActions() || true) {
                @defer {
                  <organisms-grid-toolbar injectable
                    [actions]="store.gridToolbarActions()"
                    (action)="dispatch($event)"
                  />
                }
              }
              @if (store.form().get(['query'])) {
                <organisms-chips-input-section
                  [control]="store.form().get(['query'])"
                />
              }
                <organisms-table injectable
                  [items]="store.indexItems()"
                  [itemActions]="store.itemActions()"
                  [selection]="store.selection()"
                  [form]="store.form()"
                  [childrenKey]="store.tableChildrenKey()"
                  [highlight]="store.highlight()"
                  (action)="dispatch($event)"
                />
                @if (store.form().get(['page'])) {
                  @defer {
                    <organisms-paginator injectable
                      [form]="store.form().get(['page'])"
                      [itemLength]="store.indexItemsLength()"
                      [pageSizeOptions]="store.pageSizeOptions()"
                    />
                  }
                }
              </div>
            </frames-divider>
          }
        }
      }
    </frames-auto-layout>
  </frames-scroll>
  `,
  styleUrls: ['./index.template.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'template' },
  hostDirectives: [
    {
      directive: IndexTemplateStore,
      inputs: [
        'gridToolbarActions', 'tableChildrenKey', 'form', 'title',
        'description', 'items', 'itemActions', 'navStartActions',
        'navEndActions', 'groupedBy', 'groupKeys',
        'selection', 'pageSizeOptions',
        'type',
        'highlight'
      ],
      outputs: [],
    }
  ],
  providers: [
    QueryResolverService,
  ],
})
export class IndexTemplate<T> extends NgAtomicComponent {
  static ActionId = ActionId;
  protected ActionId = ActionId;
  protected store = inject(IndexTemplateStore);
  
  readonly dividerFrame = viewChild(DividerFrame);

  @Effect(TableOrganism.ActionId.HEADER_CLICK)
  protected onTableHeaderClick(column: string) {
    this.dispatch({id: ActionId.TABLE_HEADER_CLICK, payload: column});
  }

  @Effect(TableOrganism.ActionId.CHECKBOX_CLICK)
  protected onCheckboxClickItem(item: T) {
    this.dispatch({id: ActionId.CHECKBOX_CLICK, payload: item});
  }

  @Effect(GridCardsSectionOrganism.ActionId.ITEM_CLICK)
  @Effect(SmartListOrganism.ActionId.CLICK_ITEM)
  protected onItemClicked(item: T) {
    this.dispatch({id: ActionId.ITEM_CLICK, payload: item});
  }

  @Effect(GridCardsSectionOrganism.ActionId.ITEM_MENU_CLICK)
  @Effect(SmartListOrganism.ActionId.ITEM_BUTTON_CLICK)
  protected onItemButtonClicked(item: T) {
    this.dispatch({id: ActionId.LIST_ITEM_BUTTON_CLICKED, payload: item});
  }

  @Effect(NavActionId.BACK)
  protected back() {
    this.dispatch({id: ActionId.BACK});
  }
}
