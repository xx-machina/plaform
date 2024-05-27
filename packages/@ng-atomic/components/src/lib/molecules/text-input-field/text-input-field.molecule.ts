import { ChangeDetectionStrategy, Component, Directive, inject, input } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { ErrorPipe } from '@ng-atomic/common/pipes/error';
import { InjectableComponent, NgAtomicComponent, TokenizedType } from '@ng-atomic/core';

@TokenizedType()
@Directive({standalone: true, selector: 'molecules-text-input-field'})
export class TextInputFieldMoleculeStore extends InjectableComponent {
  readonly appearance = input<'outline' | 'fill'>('outline');
  readonly type = input<'text' | 'number' | 'password'>('text');
  readonly name = input<string>();
  readonly label = input('label');
  readonly control = input(new FormControl<string | number>(''));
  readonly placeholder = input('placeholder');
  readonly hint = input<string>();
  readonly pattern = input<string>();
  readonly autoComplete = input<(number | string)[]>([]);
}

@Component({
  selector: 'molecules-text-input-field',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatInputModule,
    MatAutocompleteModule,
    ErrorPipe,
  ],
  template: `
  <mat-form-field [appearance]="store.appearance()">
    <mat-label>{{ store.label() }}</mat-label>
      <input
        matInput
        [name]="store.name()"
        [type]="store.type()"
        [formControl]="store.control()"
        [placeholder]="store.placeholder()"
        [matAutocomplete]="auto"
        [pattern]="store.pattern()"
      >
      @if (store.control()?.errors) {
        <mat-error>{{ store.control()?.errors | error }}</mat-error>
      }
      @if (store.hint()) {
        <mat-hint>{{ store.hint() }}</mat-hint>
      }
      <mat-autocomplete
        autoSelectActiveOption
        #auto="matAutocomplete"
      >
        @for (option of store.autoComplete(); track option;) {
          <mat-option [value]="option">{{ option }}</mat-option>
        }
      </mat-autocomplete>
  </mat-form-field>
  `,
  styleUrls: ['./text-input-field.molecule.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {class: 'molecule field'},
  hostDirectives: [
    {
      directive: TextInputFieldMoleculeStore,
      inputs: ['appearance', 'type', 'name', 'label', 'control', 'placeholder', 'hint', 'autoComplete', 'pattern'],
    }
  ]
})
export class TextInputFieldMolecule extends NgAtomicComponent {
  protected store = inject(TextInputFieldMoleculeStore)
}
