import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Directive, input, inject } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { NgAtomicComponent } from '@ng-atomic/core';
import { ErrorPipe } from '@ng-atomic/common/pipes/error';

export enum ActionId {
  CTRL_ENTER_KEY_UP = 'Ctrl Enter Key Up',
}

@Directive({ standalone: true, selector: 'molecules-textarea-field' })
export class TextareaFieldMoleculeStore {
  readonly label = input('label');
  readonly appearance = input<'legacy' | 'standard' | 'fill' | 'outline'>('outline');
  readonly hint = input<string>(null);
  readonly placeholder = input('placeholder');
  readonly floatLabel = input<'auto' | 'always' | 'never'>('auto');
  readonly control = input(new FormControl(''));
  readonly rows = input(10);
}

@Component({
  selector: 'molecules-textarea-field',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatInputModule,
    ErrorPipe,
  ],
  template: `
  <mat-form-field [appearance]="store.appearance()" [floatLabel]="store.floatLabel()">
    <mat-label>{{ store.label() }}</mat-label>
    <textarea
      matInput
      [formControl]="store.control()"
      [placeholder]="store.placeholder()"
      (keyup)="onKeyup($event)"
      [rows]="store.rows()"
    ></textarea>
    @if (store.control().errors) {
      <mat-error>{{ store.control().errors | error }}</mat-error>
    }
    @if (store.hint()) {
      <mat-hint>{{ store.hint() }}</mat-hint>
    }
  </mat-form-field>`,
  styleUrls: ['./textarea-field.molecule.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {class: 'molecule field'},
  hostDirectives: [
    {
      directive: TextareaFieldMoleculeStore,
      inputs: ['label', 'appearance', 'hint', 'placeholder', 'floatLabel', 'control', 'rows'],
    },
  ],
})
export class TextareaFieldMolecule extends NgAtomicComponent {
  protected readonly store = inject(TextareaFieldMoleculeStore);

  protected onKeyup($event) {
    if($event.ctrlKey && $event.key === 'Enter') {
      this.dispatch({id: ActionId.CTRL_ENTER_KEY_UP});
      $event.preventDefault();
    }
  }

}
