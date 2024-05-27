import { Component, Directive, Signal, computed, inject, input, signal } from '@angular/core';
import { RouterOutletFrame } from '@ng-atomic/components/frames/router-outlet';
import { IndexTemplate } from '@ng-atomic/components/templates/_index';
import { injectAll } from '@ng-atomic/common/stores/entities';
import { injectModel, injectModelName } from '@ng-atomic/common/pipes/domain';
import { Actions, Effect, InjectableComponent, NgAtomicComponent, _computed } from '@ng-atomic/core';
import { ActivatedRoute, Router } from '@angular/router';
import { buildColumns, injectIndexForm } from '@ng-atomic/components/organisms/table';
import { injectIsRootPage, injectNavStartActions, makeConfig } from '@ng-atomic/common/services/ui';
import { SelectionModel } from '@angular/cdk/collections';
import { injectEntityIdName } from '@ng-atomic/components/pages/form';
import { injectChildRouteParam } from "@ng-atomic/common/utils";

export function injectHighlight(key: string): Signal<SelectionModel<string>> {
  const transferId = injectChildRouteParam(key);
  return computed(() => new SelectionModel<string>(true, [transferId()]));
}

enum ActionId {
  BACK = '[@ng-atomic/components/pages] Back',
  CHECKBOX_CLICK = '[@ng-atomic/components/pages] CheckboxClick',
  ADD = '[@ng-atomic/components/pages] Add',
  DETAIL = '[@ng-atomic/components/pages] Detail',
}

@Directive({ standalone: true })
export class IndexPageStore extends InjectableComponent {
  static readonly ActionId = ActionId;
  static readonly Config = makeConfig(() => {
    const highlight = injectHighlight(injectEntityIdName());
    const isRootPage = injectIsRootPage();
    const navStartActions = injectNavStartActions(isRootPage);
    return () => ({
      style: {
        width: 'var(--page-width-lv3)',
      },
      items: [],
      itemActions: () => [] as Actions,
      title: `${injectModelName()()}一覧`,
      type: 'table',
      selection: new SelectionModel<string>(true, []),
      highlight: highlight(),
      form: injectIndexForm({
        columns: buildColumns([
          'id', 
          'createdAt',
          'updatedAt',
          (item: {id: string}) => [{ id: ActionId.DETAIL, icon: 'open_in_new', name: '詳細', payload: item }],
        ]),
      }),
      navStartActions: navStartActions(),
      navEndActions: [],
      filterFunc: (item: any) => true,
    }) as any;
  }, ['components', 'pages', 'index']);
  static provideItemsFromRepository = IndexPageStore.Config.provide(() => {
    const Model = injectModel();
    const items = Model ? injectAll(Model) : signal([]);
    return (config) => ({...config, items: items()});
  });

  readonly config = IndexPageStore.Config.inject();
  readonly route = inject(ActivatedRoute);
  readonly type = input(_computed(() => this.config().type));
  readonly items = input(_computed(() => this.config().items));
  readonly itemActions = input(_computed(() => this.config().itemActions));
  readonly title = input(_computed(() => this.config().title));
  readonly form = input(_computed(() => this.config().form));
  readonly selection = input(_computed(() => this.config().selection));
  readonly highlight = input(_computed(() => this.config().highlight));
  readonly navStartActions = input(_computed(() => this.config().navStartActions));
  readonly navEndActions = input(_computed(() => this.config().navEndActions));
  readonly filterFunc = input(_computed(() => this.config().filterFunc));
  readonly filteredItems = computed(() => this.items().filter(this.filterFunc()));
}

@Component({
  selector: 'pages-index',
  standalone: true,
  imports: [
    RouterOutletFrame,
    IndexTemplate,
  ],
  template: `
  <frames-router-outlet>
    <templates-index
      [style.width]="store.config().style.width"
      [title]="store.title()"
      [type]="store.type()"
      [items]="store.filteredItems()"
      [itemActions]="store.itemActions()"
      [form]="store.form()"
      [selection]="store.selection()"
      [highlight]="store.highlight()"
      [navStartActions]="store.navStartActions()"
      [navEndActions]="store.navEndActions()"
      (action)="dispatch($event)"
    />
  </frames-router-outlet>
  `,
  styleUrl: './index.page.scss',
  hostDirectives: [IndexPageStore],
  // providers: [EffectReducer],
})
export class IndexPage extends NgAtomicComponent {
  protected store = inject(IndexPageStore);
  protected router = inject(Router);

  @Effect(IndexTemplate.ActionId.BACK)
  protected back() {
    this.dispatch({id: ActionId.BACK});
  }

  @Effect(IndexTemplate.ActionId.CHECKBOX_CLICK)
  protected checkboxClick(item: {id: string}) {
    this.store.selection().toggle(item.id);
  }

  @Effect(IndexTemplate.ActionId.ITEM_CLICK)
  protected itemClick(item: {id: string}) {
    this.dispatch({id: ActionId.DETAIL, payload: item});
  }

  // @Effect(ActionId.DETAIL)
  // protected detail(item: {id: string}) {
  //   this.router.navigate([item?.id ?? 'new'], {relativeTo: this.store.route});
  // }
}
