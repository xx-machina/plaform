import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { LegacyPageEvent as PageEvent } from '@angular/material/legacy-paginator';
import { CommonModule } from '@angular/common';
import { AutoLayoutFrame } from '@ng-atomic/components/frames/auto-layout';
import { ScrollFrame } from '@ng-atomic/components/frames/scroll';
import { HeaderMolecule } from '@ng-atomic/components/molecules/header';
import { SmartTableOrganism } from '@ng-atomic/components/organisms/smart-table';
import { SmartListOrganism, ActionId as ListActionId } from '@ng-atomic/components/organisms/smart-list';
import { NavigatorOrganism } from '@ng-atomic/components/organisms/navigator';
import { PaginatorOrganism } from '@ng-atomic/components/organisms/paginator';
import { Action } from '@ng-atomic/common/models';
import { FormControl, FormGroup } from '@angular/forms';
import { GridToolbarOrganism } from '@ng-atomic/components/organisms/grid-toolbar';
import { FiltersSectionOrganism } from '@ng-atomic/components/organisms/filters-section';
import { DividerFrame } from '@ng-atomic/components/frames/divider';

export enum ActionId {
  BACK = '[@ng-atomic/components/templates/smart-index] Back',
  TABLE_HEADER_CLICK = '[@ng-atomic/components/templates/smart-index] Table Header Click',
  ITEM_CLICK = '[@ng-atomic/components/templates/smart-index] Item Click',
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
  templateUrl: './smart-index.template.html',
  styleUrls: ['./smart-index.template.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'template' },
})
export class SmartIndexTemplate<T> {
  protected ActionId = ActionId;

  @Input()
  gridToolbarActions: Action[] = [];

  @Input()
  tableChildrenKey: string = '';

  @Input()
  form = new FormGroup({
    pageIndex: new FormControl(0),
    pageSize: new FormControl(0),
    length: new FormControl(0),
  });

  @Input()
  queryControl = new FormControl<string>('');

  @Input()
  title: string = '';

  @Input()
  description?: string;

  @Input()
  items: T[] = [];

  @Input()
  itemActions: (item: T) => Action[] = () => [];

  @Input()
  navStartActions: Action[] = [{ id: ActionId.BACK, icon: 'arrow_back' }];

  @Input()
  navEndActions: Action[] = [];

  @Input()
  properties: (keyof T)[] =  [];

  @Input()
  selectedIdSet = new Set<string>();

  @Input()
  sortKey?: string;

  @Input()
  sortOrder?: string;

  @Input()
  page?: PageEvent = {
    pageIndex: 0,
    pageSize: 20,
    length: 100,
  };

  @Input()
  pageSizeOptions: number[] = [5, 10, 25, 100];

  @Input()
  queryPlaceholder = '';

  @Input()
  device: 'sp' | 'tablet' | 'pc' = 'sp';

  @Output()
  action = new EventEmitter<Action>();

  @Output()
  backButtonClick = new EventEmitter();

  @Output()
  checkboxClick = new EventEmitter<T>();

  @Output()
  pageChange = new EventEmitter<PageEvent>();

  onAction(action: Action): void {
    switch(action.id) {
      case ListActionId.CLICK_ITEM:
        return this.action.emit({...action, id: ActionId.ITEM_CLICK});
      default: return this.action.emit(action);
    }
  }
}
