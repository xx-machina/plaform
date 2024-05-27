import { ChangeDetectionStrategy, Component, Directive, effect, inject, input, TemplateRef } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { InjectableComponent } from '@ng-atomic/core';

@Directive({ standalone: true, selector: 'organisms-agreement-input-section-store' })
export class AgreementInputSectionOrganismStore extends InjectableComponent {
  readonly control = input(new FormControl<boolean>(true));
  readonly label = input('label');
  readonly labelTemp = input<TemplateRef<any>>(null);

  constructor() {
    super();
    effect(() => {
      console.debug('labelTemp:', this.labelTemp());
    });
  }
}

@Component({
  selector: 'organisms-agreement-input-section',
  standalone: true,
  imports: [
    NgTemplateOutlet,
    MatCheckboxModule,
    ReactiveFormsModule,
  ],
  template: `
  <mat-checkbox [formControl]="store.control()">
    @if (store.labelTemp()) {
      <ng-container *ngTemplateOutlet="store.labelTemp()" />
    } @else if (store.label()) {
      <span>{{ store.label() }}</span>
    } @else {
      <ng-content />
    }
  </mat-checkbox>
  `,
  styleUrls: ['./agreement-input-section.organism.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  hostDirectives: [
    {
      directive: AgreementInputSectionOrganismStore,
      inputs: ['control', 'label', 'labelTemp'],
    },
  ],
})
export class AgreementInputSectionOrganism {
  protected readonly store = inject(AgreementInputSectionOrganismStore);
}
