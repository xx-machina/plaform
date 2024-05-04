import { ChangeDetectionStrategy, Component, Input, Pipe, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatInput, MatInputModule } from '@angular/material/input';
import { Action } from '@ng-atomic/core';
import { SmartMenuButtonAtom } from '@ng-atomic/components/atoms/smart-menu-button';
import { NgAtomicComponent } from '@ng-atomic/core';
import { MatFormField } from '@angular/material/form-field';
import { ErrorPipe } from '@ng-atomic/common/pipes/error';
import { startWith } from 'rxjs';


@Component({
  selector: 'molecules-action-input-field',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatInputModule,
    SmartMenuButtonAtom,
    ErrorPipe,
  ],
  template: `
  <mat-form-field class="mat-form-field-disabled" [appearance]="appearance">
    <mat-label>{{ label }}</mat-label>
    <input matInput [name]="name" type="text" [formControl]="control" [placeholder]="placeholder">
    <!-- <mat-icon matSuffix>sentiment_very_satisfied</mat-icon> -->
    <mat-hint *ngIf="hint">{{ hint }}</mat-hint>
    <mat-error>{{ control.errors | error }}</mat-error>
  </mat-form-field>
  <atoms-smart-menu-button
    [actions]="actions"
    (action)="dispatch($event)"
  ></atoms-smart-menu-button>
  `,
  styleUrls: ['./action-input-field.molecule.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ActionInputFieldMolecule extends NgAtomicComponent {

  @ViewChild(MatFormField)
  formField!: MatFormField;

  @ViewChild('matInput', { read: MatInput })
  input!: MatInput;

  @Input()
  appearance: 'outline' | 'fill' = 'outline';

  @Input()
  type: 'text' | 'number' | 'password' = 'text';

  @Input()
  name?: string;

  @Input()
  label = 'label';

  @Input()
  control = new FormControl<string>('');

  @Input()
  placeholder = 'placeholder';

  @Input()
  hint?: string;

  @Input()
  get actions(): Action[] {
    return this._actions.map((action) => ({...action}));
  }
  set actions(value: Action[]) {
    this._actions = value;
  }
  private _actions: Action[] = [];

  ngAfterViewInit() {
    this.formField._getDisplayedMessages = function (): 'error' | 'hint' {
      return this._errorChildren && this._errorChildren.length > 0 ? 'error' : 'hint';
    };
  }

}
