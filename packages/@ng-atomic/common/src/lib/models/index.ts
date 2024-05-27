import { Actions } from '@ng-atomic/core';

export * from './menu-item';


export interface Page {
  pageIndex: number;
  pageSize: number;
}

export interface Sort {
  key: string;
  order: 'asc' | 'desc';
}

export interface Index {
  query: string;
  page: Page;
  sort: Sort;
}

export type ColumnType = 'text' | 'actions' | 'checkbox' | 'tree';


export interface BaseColumn {
  type: ColumnType;
  name: string;
  visible: boolean;
  width: number;
  headerText?: string;
  sort?: boolean;
}

export interface ActionsColumn extends BaseColumn {
  type: 'actions';
  actions?: Actions;
}

export interface TextColumn extends BaseColumn {
  type: 'text';
}

export interface CheckboxColumn extends BaseColumn {
  type: 'checkbox';
}

export interface TreeColumnMolecule extends BaseColumn {
  type: 'tree';
}

export type Column = ActionsColumn | TextColumn | CheckboxColumn | TreeColumnMolecule;
