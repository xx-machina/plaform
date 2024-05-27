import { ChangeDetectionStrategy, Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder } from '@angular/forms';
import { TextInputFieldMolecule } from '@ng-atomic/components/molecules/text-input-field';

@Component({
  selector: 'organisms-time-range-input-section',
  standalone: true,
  imports: [
    CommonModule, 
    TextInputFieldMolecule,
  ],
  template: `
    <molecules-text-input-field
      [label]="'開始範囲時刻'"
      [control]="control.get(['start'])"
    />
    <molecules-text-input-field
      [label]="'終了範囲時刻'"
      [control]="control.get(['end'])"
    />
  `,
  styleUrls: ['./time-range-input-section.organism.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TimeRangeInputSectionOrganism {
  @Input() control = inject(FormBuilder).group({
    start: ['00:00'],
    end: ['01:00'],
  });
}
