import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { ErrorPipe } from '@ng-atomic/common/pipes/error';
import dayjs from 'dayjs';

@Component({
  selector: 'molecules-date-range-input-field',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatDatepickerModule,
    ErrorPipe,
  ],
  template: `
    <mat-form-field appearance="outline">
      <mat-label>{{ label }}</mat-label>
      <mat-date-range-input
        [formGroup]="control"
        [rangePicker]="picker"
        [comparisonStart]="control.value.start"
        [comparisonEnd]="control.value.end">
        <input matStartDate placeholder="Start date" formControlName="start">
        <input matEndDate placeholder="End date" formControlName="end">
      </mat-date-range-input>
      <mat-hint *ngIf="hint">{{ hint }}</mat-hint>
      <mat-error>{{ control.errors | error }}</mat-error>
      <mat-datepicker-toggle matIconSuffix [for]="picker"></mat-datepicker-toggle>
      <mat-date-range-picker #picker></mat-date-range-picker>
    </mat-form-field>
  `,
  styleUrls: ['./date-range-input-field.molecule.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DateRangeInputFieldMolecule {
  @Input() control = new FormGroup({
    start: new FormControl(dayjs()),
    end: new FormControl(dayjs()),
  });
  @Input() label = '';
  @Input() placeholder = '';
  @Input() hint?: string;
}
