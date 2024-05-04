import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatDayjsDateModule } from '@ng-atomic/common/utils';
import dayjs, { Dayjs } from 'dayjs';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'molecules-date-input-field',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatDatepickerModule,
    MatDayjsDateModule,
  ],
  templateUrl: './date-input-field.molecule.html',
  styleUrls: ['./date-input-field.molecule.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {class: 'molecule field'},
})
export class DateInputFieldMolecule {
  protected readonly _control = new FormControl<Dayjs>(dayjs());

  @Input()
  control = new FormControl<Dayjs>(dayjs());

  @Input()
  label = '';

  @Input()
  placeholder = '';

  @Input()
  hint?: string;

  ngOnInit(): void {
    this._control.valueChanges.pipe(
      filter(value => this.control.value !== value),
    ).subscribe(value => this.control.setValue(value));

    this.control.valueChanges.subscribe(value => this._control.setValue(value));
    this._control.setValue(this.control.value);
  }
}
