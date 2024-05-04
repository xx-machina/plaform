import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, Output, EventEmitter } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { Action } from '@ng-atomic/common/models';
import { ErrorPipe } from '@ng-atomic/common/pipes/error';

export enum ActionId {
  CTRL_ENTER_KEY_UP = 'Ctrl Enter Key Up',
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
  <mat-form-field appearance="outline">
    <mat-label>{{ label }}</mat-label>
    <textarea
      matInput
      [formControl]="control"
      [placeholder]="placeholder"
      (keyup)="onKeyup($event)"
      [rows]="rows"
    ></textarea>
    <mat-hint *ngIf="hint">{{ hint }}</mat-hint>
    <mat-error>{{ control.errors | error }}</mat-error>
  </mat-form-field>`,
  styleUrls: ['./textarea-field.molecule.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {class: 'molecule field'},
})
export class TextareaFieldMolecule {

  @Input()
  label = 'label';

  @Input()
  hint?: string;

  @Input()
  placeholder = 'placeholder';

  @Input()
  control = new FormControl('');

  @Input()
  rows = 10;

  @Output()
  action = new EventEmitter<Action>();

  protected onKeyup($event) {
    if($event.ctrlKey && $event.key === 'Enter') {
      this.action.emit({id: ActionId.CTRL_ENTER_KEY_UP});
      $event.preventDefault();
    }
  }

}
