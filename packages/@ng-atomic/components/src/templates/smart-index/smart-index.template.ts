import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { LegacyPageEvent as PageEvent } from '@angular/material/legacy-paginator';
import { CommonModule } from '@angular/common';
import { AutoLayoutModule } from '@ng-atomic/components/frames/auto-layout';
import { ScrollModule } from '@ng-atomic/components/frames/scroll';
import { HeaderModule } from '@ng-atomic/components/molecules/header';
import { SmartTableModule } from '@ng-atomic/components/organisms/smart-table';
import { SmartListModule } from '@ng-atomic/components/organisms/smart-list';
import { NavigatorModule } from '@ng-atomic/components/organisms/navigator';
import { PaginatorModule } from '@ng-atomic/components/organisms/paginator';
import { Action } from '@ng-atomic/common/models';
import { FormControl } from '@ngneat/reactive-forms';

export enum ActionId {
  BACK = '[@ng-atomic/components/templates/smart-index] Back',
  TABLE_HEADER_CLICK = '[@ng-atomic/components/templates/smart-index] Table Header Click',
}

@Component({
  standalone: true,
  imports: [
    CommonModule,
    // Frames
    AutoLayoutModule,
    ScrollModule,
    // Organisms
    PaginatorModule,
    SmartTableModule,
    SmartListModule,
    NavigatorModule,
    // Molecules
    HeaderModule,
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
      default: return this.action.emit(action);
    }
  }
}
