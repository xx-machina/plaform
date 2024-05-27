import { ChangeDetectionStrategy, Component, Directive, inject, input } from '@angular/core';
import { MatDivider } from '@angular/material/divider';
import { MatLabel } from '@angular/material/form-field';
import { NgAtomicComponent } from '@ng-atomic/core';

@Directive({ standalone: true, selector: 'organisms-definition-list' })
export class DefinitionListOrganismStore {
  readonly label = input('label');
}

@Component({
  selector: 'organisms-definition-list',
  standalone: true,
  imports: [
    MatDivider,
    MatLabel,
  ],
  template: `
  <section>
    <dl>
      <ng-content/>
      <!-- <dt>寄付金額</dt> <dd>¥2,000</dd>
      <dt>手数料</dt> <dd>¥0</dd>
      <mat-divider />
      <dt>支払金額</dt> <dd>¥2,000</dd> -->
    </dl>
  </section>
  `,
  styleUrl: './definition-list.organism.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  hostDirectives: [
    {
      directive: DefinitionListOrganismStore,
      inputs: ['label'],
    },
  ]
})
export class DefinitionListOrganism extends NgAtomicComponent {
  protected readonly store = inject(DefinitionListOrganismStore);
  // readonly definitionItems = 
}
