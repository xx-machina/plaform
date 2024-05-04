import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { ErrorPipe } from '@ng-atomic/common/pipes/error';

export interface Option<T> {
  name: string;
  value: T;
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
  <mat-form-field [appearance]="appearance">
    <mat-label>{{ label }}</mat-label>
    <mat-select [formControl]="control">
      <mat-option *ngFor="let option of options; trackBy value;" [value]="option.value">
        {{ option.name }}
      </mat-option>
    </mat-select>
    <mat-error>{{ control.errors | error }}</mat-error>
  </mat-form-field>
  `,
  styleUrls: ['./select-input-field.molecule.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {class: 'molecule input-field field'},
})
export class SelectInputFieldMolecule<T> {

  @Input()
  label: string = '';

  @Input()
  appearance: 'outline' | 'fill' = 'outline';

  @Input()
  control = new FormControl<T>({} as T);

  @Input()
  options: Option<T>[] = [];

  value = (item: Option<T>) => item?.value; 

}
