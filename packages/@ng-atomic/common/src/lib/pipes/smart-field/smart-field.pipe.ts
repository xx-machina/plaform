import { Inject, InjectionToken, Optional, Pipe, PipeTransform, Signal } from '@angular/core';
import { Action } from '@ng-atomic/common/models';
import { SignalOrValue } from '@ng-atomic/common/pipes/signal';
import get from 'lodash.get';


interface Option<T> {
  name: string;
  value: T;
}

interface BaseField {
  placeholder?: string;
  hint?: string;
}

interface InputField extends BaseField {
  type: 'input';
  autoComplete?: SignalOrValue<(string | number)[]>;
}

interface TextareaField extends BaseField {
  type: 'textarea';
  rows?: number;
}

interface DateInputField extends BaseField {
  type: 'date';
}

interface SelectField<T> extends BaseField {
  type: 'select';
  options: Option<T>[];
}

interface MultiSelectField<T> extends BaseField {
  type: 'multi-select';
  options: Option<T>[];
}

interface FileField extends BaseField {
  type: 'file';
  progress?: Signal<number>;
}

interface ActionField extends BaseField {
  type: 'action';
  actions: Action[] | Signal<Action[]>;
  disabled?: boolean;
}

interface NoneField {
  type: 'none';
}

type FormField<V> = InputField
  | TextareaField
  | DateInputField
  | SelectField<V>
  | MultiSelectField<V>
  | FileField
  | ActionField
  | NoneField;

export interface FormFieldMap {
  [key: string]: FormField<any> | FormFieldMap;
}

export const FORM_FIELD_MAP = new InjectionToken<FormFieldMap>('[@ng-atomic] Smart Form Field');

@Pipe({
  name: 'smartField',
  standalone: true,
  pure: true,
})
export class SmartFieldPipe implements PipeTransform {

  constructor(
    @Optional() @Inject(FORM_FIELD_MAP) private map: Record<string, FormField<any>>
  ) {
    this.map ??= {
      createdAt: { type: 'date' },
      updatedAt: { type: 'date' },
      deletedAt: { type: 'date' },
    };
  }

  transform(key: string): FormField<any> {
    return get(this.map, key) ?? {type: 'input'};
  }

}
