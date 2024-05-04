import { ChangeDetectionStrategy, Component, Directive, EventEmitter, Input, Output, inject } from '@angular/core';
import { LegacyPageEvent as PageEvent } from '@angular/material/legacy-paginator';
import { CommonModule } from '@angular/common';
import { AutoLayoutFrame } from '@ng-atomic/components/frames/auto-layout';
import { ScrollFrame } from '@ng-atomic/components/frames/scroll';
import { HeaderMolecule } from '@ng-atomic/components/molecules/header';
import { SmartTableOrganism } from '@ng-atomic/components/organisms/smart-table';
import { SmartListOrganism, ActionId as ListActionId } from '@ng-atomic/components/organisms/smart-list';
import { NavigatorOrganism } from '@ng-atomic/components/organisms/navigator';
import { PaginatorOrganism } from '@ng-atomic/components/organisms/paginator';
import { Action, Actions } from '@ng-atomic/common/models';
import { FormControl, FormGroup } from '@angular/forms';
import { GridToolbarOrganism } from '@ng-atomic/components/organisms/grid-toolbar';
import { FiltersSectionOrganism } from '@ng-atomic/components/organisms/filters-section';
import { DividerFrame } from '@ng-atomic/components/frames/divider';
import { SelectionModel } from '@angular/cdk/collections';

export enum ActionId {
  BACK = '[@ng-atomic/components/templates/smart-index] Back',
  TABLE_HEADER_CLICK = '[@ng-atomic/components/templates/smart-index] Table Header Click',
  ITEM_CLICK = '[@ng-atomic/components/templates/smart-index] Item Click',
  CHECKBOX_CLICK = '[@ng-atomic/components/templates/smart-index] Check Item',
}


@Directive({ standalone: true })
export class NgAtomicDirective {
  @Output()
  action = new EventEmitter<Action>();

  ngOnInit() {
    this.action.subscribe(action => {
      console.debug('NgAtomicDirective.action', action);
    });
  }

  onAction(action: Action): void {
    switch(action.id) {
      case ListActionId.CLICK_ITEM:
        return this.action.emit({...action, id: ActionId.ITEM_CLICK});
      default: return this.action.emit(action);
    }
  }

  dispatch(action: Action): void {
    this.action.emit(action);
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
    NavigatorOrganism,
    FiltersSectionOrganism,
    HeaderMolecule,
  ],
  selector: 'templates-smart-index',
  template: `
  <frames-scroll>
    <organisms-navigator
      [startActions]="navStartActions"
      [endActions]="navEndActions"
      (action)="ngAtomic.onAction($event)"
      navigator
    >
      <molecules-header [title]="title" [description]="description"></molecules-header>
    </organisms-navigator>
    <frames-auto-layout vertical contents [ngSwitch]="device">
      <ng-container *ngSwitchCase="'sp'">
        <organisms-smart-list
          [items]="items"
          (action)="ngAtomic.onAction($event)"
        ></organisms-smart-list>
      </ng-container>
      <ng-container *ngSwitchDefault>
        <frames-divider>
          <ng-content first select="[dashboard]"></ng-content>
          <div style="display: flex; flex-direction: column; width: 100%; height: 100%;" second>
            <organisms-grid-toolbar
              *ngIf="gridToolbarActions || true"
              [actions]="gridToolbarActions"
              [control]="form.get(['query'])"
              (action)="ngAtomic.onAction($event)"
            ></organisms-grid-toolbar>
            <organisms-smart-table
              [items]="items"
              [itemActions]="itemActions"
              [columns]="properties"
              [selection]="selection"
              [form]="form.get(['sort'])"
              [childrenKey]="tableChildrenKey"
              (action)="ngAtomic.onAction($event)"
              (checkboxClick)="onCheckboxClickItem($event)"
              (headerClick)="ngAtomic.onAction({id: ActionId.TABLE_HEADER_CLICK, payload: $event})"
            ></organisms-smart-table>
            <organisms-paginator
              *ngIf="form.get(['pagination'])"
              [form]="form.get(['pagination'])"
              [pageSizeOptions]="pageSizeOptions"
              [placeholder]="queryPlaceholder"
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
      directive: NgAtomicDirective,
      outputs: ['action'],
    }
  ],
})
export class SmartIndexTemplate<T> {
  static ActionId = ActionId;
  protected ActionId = ActionId;
  protected ngAtomic = inject(NgAtomicDirective);

  @Input()
  gridToolbarActions: Action[] = [];

  @Input()
  tableChildrenKey: string = '';

  @Input()
  form = new FormGroup({
    query: new FormControl(''),
    pagination: new FormGroup({
      pageIndex: new FormControl(0),
      pageSize: new FormControl(0),
      length: new FormControl(0),
    }),
    sort: new FormGroup({
      key: new FormControl(''),
      order: new FormControl(''),
    }),
  });

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

  @Input()
  properties: (keyof T)[] =  [];

  @Input()
  selection!: SelectionModel<string>;

  @Input()
  pageSizeOptions: number[] = [5, 10, 25, 100];

  @Input()
  queryPlaceholder = '';

  @Input()
  device: 'sp' | 'tablet' | 'pc' = 'sp';

  @Output()
  pageChange = new EventEmitter<PageEvent>();

  onCheckboxClickItem(item: T) {
    this.ngAtomic.action.emit({
      id: ActionId.CHECKBOX_CLICK,
      payload: item,
    });
  }
}
