import { ChangeDetectionStrategy, Component, Directive, effect, inject, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { ErrorPipe } from '@ng-atomic/common/pipes/error';
import dayjs from 'dayjs';

@Directive({selector: 'molecules-date-range-input-field', standalone: true})
export class DateRangeInputFieldMoleculeStore {
  readonly control = input(new FormGroup({
    start: new FormControl(dayjs()),
    end: new FormControl(dayjs()),
  }));
  readonly label = input('');
  readonly hint = input<string>(undefined);

  constructor() {
    effect(() => {
      console.debug('control:', this.control().value);
    });
  }
}

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
      <mat-label>{{ store.label() }}</mat-label>
      <mat-date-range-input
        [formGroup]="store.control()"
        [rangePicker]="picker"
        [comparisonStart]="store.control().value.start"
        [comparisonEnd]="store.control().value.end">
        <input matStartDate placeholder="Start date" formControlName="start">
        <input matEndDate placeholder="End date" formControlName="end">
      </mat-date-range-input>
      @if (store.hint()) {
        <mat-hint>{{ store.hint() }}</mat-hint>
      }
      <mat-error>{{ store.control().errors | error }}</mat-error>
      <mat-datepicker-toggle matIconSuffix [for]="picker"></mat-datepicker-toggle>
      <mat-date-range-picker #picker></mat-date-range-picker>
    </mat-form-field>
  `,
  styleUrls: ['./date-range-input-field.molecule.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  hostDirectives: [
    {
      directive: DateRangeInputFieldMoleculeStore,
      inputs: ['control', 'label', 'hint']
    }
  ]
})
export class DateRangeInputFieldMolecule {
  protected readonly store = inject(DateRangeInputFieldMoleculeStore);
}
