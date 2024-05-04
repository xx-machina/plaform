import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Directive, Input, inject, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { ErrorPipe } from '@ng-atomic/common/pipes/error';
import { signalize } from '@ng-atomic/common/pipes/signal';

@Directive({standalone: true, selector: 'molecules-text-input-field'})
export class TextInputFieldMoleculeStore {
  @Input() readonly appearance: 'outline' | 'fill' = 'outline';
  @Input() readonly type: 'text' | 'number' | 'password' = 'text';
  @Input() readonly name?: string;
  @Input() readonly label: string = 'label';
  @Input() readonly control = new FormControl<string | number>('');
  @Input() readonly placeholder = 'placeholder';
  @Input() readonly hint?: string;
  @Input({transform: (v: any) => signalize(v)}) readonly autoComplete = signal<number | string[]>([]);
}

@Component({
  selector: 'molecules-text-input-field',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatAutocompleteModule,
    ErrorPipe,
  ],
  template: `
  <mat-form-field [appearance]="store.appearance">
    <mat-label>{{ store.label }}</mat-label>
      <input
        matInput
        [name]="store.name"
        [type]="store.type"
        [formControl]="store.control"
        [placeholder]="store.placeholder"
        [matAutocomplete]="auto"
      >
      <mat-error *ngIf="store.control?.errors">{{ store.control?.errors | error }}</mat-error>
      <mat-hint *ngIf="store.hint">{{ store.hint }}</mat-hint>
      <mat-autocomplete autoActiveFirstOption #auto="matAutocomplete">
        <mat-option *ngFor="let option of store.autoComplete()" [value]="option">{{option}}</mat-option>
      </mat-autocomplete>
  </mat-form-field>
  `,
  styleUrls: ['./text-input-field.molecule.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {class: 'molecule field'},
  hostDirectives: [
    {
      directive: TextInputFieldMoleculeStore,
      inputs: ['appearance', 'type', 'name', 'label', 'control', 'placeholder', 'hint', 'autoComplete'],
    }
  ]
})
export class TextInputFieldMolecule {
  protected store = inject(TextInputFieldMoleculeStore)
}
