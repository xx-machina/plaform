import { ChangeDetectionStrategy, Component, Directive, inject, input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ChipsInputFieldMoleculeStore } from '@ng-atomic/components/molecules/chips-input-field';
import { InjectableComponent } from '@ng-atomic/core';

@Directive({standalone: true, selector: 'organisms-chips-input-section'})
export class ChipsInputSectionOrganismStore extends InjectableComponent {
  readonly control = input(new FormControl<string>(''));
}

@Component({
  selector: 'organisms-chips-input-section',
  standalone: true,
  imports: [
    ChipsInputFieldMoleculeStore,
  ],
  template: `
    <molecules-chips-input-field injectable
      [appearance]="'fill'"
      [placeholder]="'status:active'"
      [label]="'フィルター'"
      [hint]="'フィルター条件を入力できます。'"
      [control]="store.control()"
    />
  `,
  styleUrl: './chips-input-section.organism.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  hostDirectives: [
    {
      directive: ChipsInputSectionOrganismStore,
      inputs: ['control'],
    }
  ]
})
export class ChipsInputSectionOrganism {
  protected store = inject(ChipsInputSectionOrganismStore);
}
