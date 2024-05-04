import { CommonModule } from '@angular/common';
import { Component, ChangeDetectionStrategy, Input, Directive, InjectionToken, inject, Type } from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { InjectableComponent, NgAtomicComponent } from '@ng-atomic/core';
import { Action } from '@ng-atomic/core';
import { NavigationListItemMolecule } from '@ng-atomic/components/molecules/navigation-list-item';

export const Abstract = function (target) {
  (target as any)['TOKEN'] = new InjectionToken<Type<any>>(`[@ng-atomic/components] ${target.name}`);
}

@Abstract
@Directive({ standalone: true, selector: 'organisms-navigation-list' })
export class NavigationListOrganismStore extends InjectableComponent {
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
