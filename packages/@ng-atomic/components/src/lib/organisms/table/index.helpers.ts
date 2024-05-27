import { Injectable, inject } from "@angular/core";
import { FormArray, FormBuilder, FormControl, FormGroup, FormRecord } from "@angular/forms";
import { PaginationFormValue, PaginationService } from "@ng-atomic/common/services/form/pagination";
import { SortFormValue, SortService } from "@ng-atomic/common/services/form/sort";
import { Actions, wrapActions } from "@ng-atomic/core";
import { Column } from "@ng-atomic/common/models";
import { injectProps } from "@ng-atomic/common/pipes/domain";
import { omitBy } from "lodash-es";

export type ActionsColumnForm = FormGroup<{
  type: FormControl<'actions'>,
  name: FormControl<string>,
  visible: FormControl<boolean>,
  width: FormControl<number>,
  actions: FormControl<any>,
}>;

export type CheckboxColumnForm = FormGroup<{
  type: FormControl<'checkbox'>,
  name: FormControl<string>,
  visible: FormControl<boolean>,
  width: FormControl<number>,
}>;

export type TextColumnForm = FormGroup<{
  type: FormControl<'text'>,
  name: FormControl<string>,
  visible: FormControl<boolean>,
  width: FormControl<number>,
}>;

export type ColumnsForm = FormArray<FormRecord<ActionsColumnForm | CheckboxColumnForm | TextColumnForm>>;

export function buildColumns(columns: (string | Actions)[]): Column[] {
  return columns.map(column => {
    if (typeof column === 'string') {
      if (column === '__actions') {
        return {
          type: 'actions',
          name: 'actions',
          visible: true,
          width: 80,
        }
      } if (column === '__checkbox') {
        return {
          type: 'checkbox',
          name: 'checkbox',
          visible: true,
          width: 80,
        }
      } else {
        return {
          type: 'text',
          name: column,
          visible: true,
          width: 80,
        };
      }      
    } else {
      return {
        type: 'actions',
        name: 'actions',
        visible: true,
        width: 80,
        actions: wrapActions(column),
      };
    }
  }); 
}



@Injectable({ providedIn: 'root' })
export class IndexTemplateFormBuilder {
  sort = inject(SortService);
  pagination = inject(PaginationService)
  fb = inject(FormBuilder);

  static buildColumns = buildColumns;

  build({
    query = undefined,
    sort = {},
    page = {},
    columns = [],
  }: {
    query?: string,
    page?: Partial<PaginationFormValue>,
    sort?: Partial<SortFormValue>,
    columns?: Column[],
  } = {}) {
    const omit = <T extends object>(obj: T) => omitBy(obj, value => value === undefined) as T;
    return this.fb.group(omit({
      query: typeof query !== 'undefined' ? this.fb.control(query) : undefined,
      page: this.pagination.build(page),
      sort: this.sort.build(sort),
      columns: this.buildColumnsForm(columns),
    }));
  }

  buildColumnsForm(columns: Column[]) {
    return this.fb.array(columns.map(column => {
      switch (column.type) {
        case 'text':
          return this.fb.group({
            type: this.fb.control({value: 'text' as const, disabled: true}),
            name: this.fb.control({value: column.name, disabled: true}),
            visible: this.fb.control(column.visible),
            width: this.fb.control(80),
          }) as TextColumnForm;
        case 'checkbox':
          return this.fb.group({
            type: this.fb.control({value: 'checkbox' as const, disabled: true}),
            name: this.fb.control({value: 'checkbox', disabled: true}),
            visible: this.fb.control(column.visible),
            width: this.fb.control(80),
          }) as CheckboxColumnForm;
        case 'actions':
          return this.fb.group({
            type: this.fb.control({value: 'actions' as const, disabled: true}),
            name: this.fb.control({value: 'actions', disabled: true}),
            visible: this.fb.control(column.visible),
            width: this.fb.control(80),
            actions: this.fb.control(column.actions),
          }) as ActionsColumnForm;
        default:
          throw new Error(`Unknown column type: ${(column as any).type}`);
      }
    }));
  }
}

export function injectIndexFormBuilder() {
  return inject(IndexTemplateFormBuilder);
}

export function injectIndexForm({
  columns = buildColumns(['__checkbox', ...injectProps()(), '__actions']),
  query = undefined,
}: {
  columns?: Column[],
  query?: string,
} = {}) {
  return inject(IndexTemplateFormBuilder).build({
    columns,
    query,
  });
}
