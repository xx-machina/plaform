import { ChangeDetectionStrategy, Component, Directive, ElementRef, HostListener, inject, input, signal } from '@angular/core';
import { NgAtomicComponent } from '@ng-atomic/core';
import { GridItemMolecule } from '@ng-atomic/components/molecules/grid-item';

enum ActionId {
  ITEM_CLICK = '[@ng-atomic/components/organisms/grid-cards-section] Item Click',
  ITEM_MENU_CLICK = '[@ng-atomic/components/organisms/grid-cards-section] Item Menu Click',
}

@Component({
  selector: 'organisms-grid-cards-section',
  standalone: true,
  imports: [
    GridItemMolecule,
  ],
  template: `
  @for (item of items(); track item.id) {
    <molecules-grid-item [item]="item" (click)="onItemClick(item)" />
  }
  `,
  styleUrls: ['./grid-cards-section.organism.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GridCardsSectionOrganism<T> extends NgAtomicComponent {
  static ActionId = ActionId;

  readonly items = input<T[]>([]);

  protected onItemClick(item: T): void {
    this.dispatch({id: ActionId.ITEM_CLICK, payload: item});
  }

  protected onItemMenuClick(item: T, $event: Event): void {
    this.dispatch({id: ActionId.ITEM_MENU_CLICK, payload: item});
    $event.stopPropagation();
  }
}
