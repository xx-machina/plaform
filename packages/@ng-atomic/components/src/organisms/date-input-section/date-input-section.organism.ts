import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { DateInputFieldMolecule } from '@ng-atomic/components/molecules/date-input-field';
import dayjs from 'dayjs';

@Component({
  selector: 'organisms-date-input-section',
  standalone: true,
  imports: [
    CommonModule,
    DateInputFieldMolecule,
  ],
  templateUrl: './date-input-section.organism.html',
  styleUrls: ['./date-input-section.organism.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {class: 'organism section'},
})
export class DateInputSectionOrganism {
  @Input()
  control = new FormControl<dayjs.Dayjs>(dayjs());

  @Input()
  label = '';

  @Input()
  placeholder = '';
}
