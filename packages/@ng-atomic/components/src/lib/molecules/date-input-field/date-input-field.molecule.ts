import { ChangeDetectionStrategy, Component, Directive, inject, input } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { ErrorPipe } from '@ng-atomic/common/pipes/error';
import { InjectableComponent } from '@ng-atomic/core';
import dayjs, { Dayjs } from 'dayjs';

@Directive({ standalone: true, selector: 'molecules-date-input-field' })
export class DateInputFieldMoleculeStore extends InjectableComponent {
  readonly control = input(new FormControl<Dayjs>(dayjs()));
  readonly label = input('');
  readonly placeholder = input('');
  readonly hint = input(null);
  readonly toggle = input(true);
  readonly control$ = toObservable(this.control);
}

@Component({
  selector: 'molecules-date-input-field',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatInputModule,
    MatDatepickerModule,
    ErrorPipe,
  ],
  template: `
  <mat-form-field appearance="outline">
    <mat-label>{{ store.label() }}</mat-label>
    <input matInput [formControl]="store.control()" [placeholder]="store.placeholder()" [matDatepicker]="picker">
    @if (store.toggle()) {
      <mat-datepicker-toggle matSuffix [for]="picker" />
    }
    <mat-datepicker #picker />
    @if (store.hint()) { <mat-hint>{{ store.hint() }}</mat-hint> }
    <mat-error>{{ store.control().errors | error }}</mat-error>
  </mat-form-field>
  `,
  styleUrls: ['./date-input-field.molecule.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  hostDirectives: [
    {
      directive: DateInputFieldMoleculeStore,
      inputs: ['control', 'label', 'placeholder', 'hint', 'toggle'],
    }
  ],
  host: {class: 'molecule field'},
  providers: [
    // provideDayjsDateAdapter(),
  ],
})
export class DateInputFieldMolecule {
  protected store = inject(DateInputFieldMoleculeStore);
}
