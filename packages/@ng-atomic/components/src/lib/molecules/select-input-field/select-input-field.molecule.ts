import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Directive, Input, inject, input } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { ErrorPipe } from '@ng-atomic/common/pipes/error';

export interface Option<T> {
  name: string;
  value: T;
}

@Directive({standalone: true})
export class SelectInputFieldMoleculeStore<T> {
  readonly control = input(new FormControl<T>({} as T));
  readonly label = input('');
  readonly appearance = input<'outline' | 'fill'>('outline');
  readonly options = input<Option<T>[]>([]);
  readonly hint = input(null); 
  readonly placeholder = input(null);
  readonly multiple = input(false);
}

@Component({
  selector: 'molecules-select-input-field',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatSelectModule,
    ErrorPipe,
  ],
  template: `
  <mat-form-field [appearance]="store.appearance()">
    <mat-label>{{ store.label() }}</mat-label>
    <mat-select [formControl]="store.control()" [multiple]="store.multiple()">
    @for (option of store.options(); track option?.value) {
      <mat-option [value]="option.value">
        {{ option.name }}
      </mat-option>
    }
    </mat-select>
    @if (store.hint()) {
      <mat-hint>{{ store.hint() }}</mat-hint>
    }
    <mat-error>{{ store.control().errors | error }}</mat-error>
  </mat-form-field>
  `,
  styleUrls: ['./select-input-field.molecule.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {class: 'molecule input-field field'},
  hostDirectives: [
    {
      directive: SelectInputFieldMoleculeStore,
      inputs: ['control', 'label', 'appearance', 'options', 'hint', 'placeholder', 'multiple'],
    },
  ],
})
export class SelectInputFieldMolecule<T> {
  protected readonly store = inject(SelectInputFieldMoleculeStore);
}
