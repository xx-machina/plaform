import { Component, ChangeDetectionStrategy, Directive, inject, input } from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { InjectableComponent, NgAtomicComponent, TokenizedType } from '@ng-atomic/core';
import { Action } from '@ng-atomic/core';
import { NavigationListItemMolecule, NavigationListItemMoleculeStore } from '@ng-atomic/components/molecules/navigation-list-item';

@TokenizedType()
@Directive({ standalone: true, selector: 'organisms-navigation-list' })
export class NavigationListOrganismStore extends InjectableComponent {
  readonly actions = input<Action<string>[]>([]);
}

@Component({
  selector: 'organisms-navigation-list',
  standalone: true,
  imports: [
    MatListModule,
    NavigationListItemMoleculeStore,
    // NavigationListItemMolecule,
  ],
  template: `
  <mat-selection-list [multiple]="false">
    <!-- TODO(@nontangent): ClickイベントがInjectableComponentでまだ拾えていない -->
    @for (action of store.actions(); track action.id) {
      <molecules-navigation-list-item injectable
        [action]="action"
        (click)="dispatch(action)"
      />
    }
  </mat-selection-list>
  `,
  styleUrls: ['./navigation-list.organism.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  hostDirectives: [
    {
      directive: NavigationListOrganismStore,
      inputs: ['actions'],
    },
  ]
})
export class NavigationListOrganism extends NgAtomicComponent {
  protected store = inject(NavigationListOrganismStore);
}
