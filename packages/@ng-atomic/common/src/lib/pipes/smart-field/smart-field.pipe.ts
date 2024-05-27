import { InjectionToken, Pipe, PipeTransform, Signal, inject } from '@angular/core';
import { Action } from '@ng-atomic/core';
import { SignalOrValue } from '@ng-atomic/common/pipes/signal';
import get from 'lodash.get';


export interface Option<T> {
  name: string;
  value: T;
}

interface BaseField {
  placeholder?: string;
  hint?: SignalOrValue<string>;
  actions?: Action[] | Signal<Action[]>;
}

interface TextField extends BaseField {
  type: 'text';
  autoComplete?: SignalOrValue<string[]>;
}

interface PasswordField extends BaseField {
  type: 'password';
}

interface NumberField extends BaseField {
  type: 'number';
}

interface TextareaField extends BaseField {
  type: 'textarea';
  rows?: number;
}

interface DateInputField extends BaseField {
  type: 'date';
}

interface DateRangeInputField extends BaseField {
  type: 'date-range';
}

interface SelectField<T> extends BaseField {
  type: 'select';
  options: Option<T>[] | Signal<Option<T>[]>;
  multiple?: boolean;
}

interface TimeRangeField extends BaseField {
  type: 'time-range';
}

//* @deprecated use multiple option */
interface MultiSelectField<T> extends BaseField {
  type: 'multi-select';
  options: Option<T>[] | Signal<Option<T>[]>;
}

interface FileField extends BaseField {
  type: 'file';
  progress?: Signal<number | null>;
}

interface ActionField extends BaseField {
  type: 'action';
  actions: Action[] | Signal<Action[]>;
  disabled?: boolean;
}

interface AgreementField {
  type: 'agreement';
  labelTemp: null | any;
}

interface HiddenField {
  type: 'hidden';
}

interface PreviewField extends BaseField {
  type: 'preview';
}

interface PreviewImageField extends BaseField {
  type: 'preview:image';
}

export type FormField<V = any> = 
  | TextField
  | PasswordField
  | TextareaField
  | DateInputField
  | DateRangeInputField
  | SelectField<V>
  | TimeRangeField
  | MultiSelectField<V>
  | FileField
  | ActionField
  | HiddenField
  | NumberField
  | PreviewField
  | AgreementField
  | PreviewImageField;

export interface FormFieldMap {
  [key: string]: FormField<any> | FormFieldMap;
}

/** @deprecated */
export const FORM_FIELD_MAP = new InjectionToken<FormFieldMap>('[@ng-atomic] Smart Form Field');

/** @deprecated */
export function provideFormFieldMap(useFactory: () => FormFieldMap) {
  return { provide: FORM_FIELD_MAP, useFactory };
}

type Enum<T> = Record<string, T>;

/** @deprecated */
export function buildOptions<T>(_enum: Enum<T>): Option<T>[] {
  return Object.values(_enum).map(value => ({value, name: value}) as Option<T>);
}

/** @deprecated */
@Pipe({name: 'smartField', standalone: true, pure: true})
export class SmartFieldPipe implements PipeTransform {
  protected map = inject(FORM_FIELD_MAP, {optional: true}) ?? {
    createdAt: { type: 'date' },
    updatedAt: { type: 'date' },
    deletedAt: { type: 'date' },
  };

  transform(key: string, map: FormFieldMap = this.map): FormField<any> {
    return get(map, key) ?? {type: 'input'};
  }
}
