import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import dayjs, { Dayjs } from 'dayjs';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'molecules-date-input-field',
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
