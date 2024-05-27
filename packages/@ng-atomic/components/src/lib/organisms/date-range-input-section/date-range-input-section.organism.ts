import { ChangeDetectionStrategy, Component, Directive, inject, input } from '@angular/core';
import { DateRangeInputFieldMolecule } from '@ng-atomic/components/molecules/date-range-input-field';
import { FormBuilder } from '@angular/forms';
import dayjs from 'dayjs';
import { Action, NgAtomicComponent } from '@ng-atomic/core';
import { SmartMenuButtonAtom } from '@ng-atomic/components/atoms/smart-menu-button';

@Directive({
  standalone: true,
  selector: 'organisms-date-range-input-section',
})
export class DateRangeInputSectionOrganismStore {
  readonly fb = inject(FormBuilder);
  readonly label = input('日付範囲');
  readonly control = input(this.fb.group({
    start: [dayjs()],
    end: [dayjs().add(1, 'day')],
  }));
  readonly hint = input('hint');
  readonly actions = input<Action[]>([]);
}

@Component({
  selector: 'organisms-date-range-input-section',
  standalone: true,
  imports: [
    DateRangeInputFieldMolecule,
    SmartMenuButtonAtom,
  ],
  template: `
    <molecules-date-range-input-field
      [label]="store.label()"
      [control]="store.control()"
    />
    @if (store.actions()?.length) {
      <atoms-smart-menu-button injectable
        [actions]="store.actions()"
        (action)="dispatch($event)"
      />
    }
  `,
  styleUrls: ['./date-range-input-section.organism.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  hostDirectives: [
    {
      directive: DateRangeInputSectionOrganismStore,
      inputs: ['label', 'hint', 'control', 'actions']
    }
  ],
  host: {class: 'organism section'},
})
export class DateRangeInputSectionOrganism extends NgAtomicComponent {
  protected store = inject(DateRangeInputSectionOrganismStore);
}
