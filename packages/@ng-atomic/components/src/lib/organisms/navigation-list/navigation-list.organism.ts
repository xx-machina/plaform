import { CommonModule } from '@angular/common';
import { Component, ChangeDetectionStrategy, Input, Directive, InjectionToken, inject } from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { InjectableComponent, NgAtomicComponent } from '@ng-atomic/common/core';
import { Action } from '@ng-atomic/common/models';
import { NavigationListItemMolecule, NavigationListItemMoleculeStore } from '@ng-atomic/components/molecules/navigation-list-item';

@Directive({ standalone: true, selector: 'organisms-navigation-list' })
export class NavigationListOrganismStore extends InjectableComponent {
  static readonly TOKEN = new InjectionToken('[@ng-atomic/components] NavigationListOrganismStore');

  @Input() actions: Action<string>[] = [];
}


@Component({
  selector: 'organisms-navigation-list',
  standalone: true,
  imports: [
    CommonModule,
    MatListModule,
    NavigationListItemMolecule,
  ],
  template: `
  <mat-selection-list [multiple]="false">
    <!-- TODO(@nontangent): ClickイベントがInjectableComponentでまだ拾えていない -->
    <molecules-navigation-list-item injectable
      *ngFor="let action of store.actions" 
      [action]="action"
      (click)="dispatch(action)"
    ></molecules-navigation-list-item>
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
