import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScrollFrame } from '@ng-atomic/components/frames/scroll-v2';
import { HeaderMolecule } from '@ng-atomic/components/molecules/header';
import { NavigatorOrganism } from '@ng-atomic/components/organisms/navigator';
import { Action } from '@ng-atomic/common/models';
import { Effect, NgAtomicComponent } from '@ng-atomic/common/stores/component-store';
import { SelectionListOrganism } from '@ng-atomic/components/organisms/selection-list';
import { ActionButtonsSectionOrganism } from '@ng-atomic/components/organisms/action-buttons-section';
import { SelectionModel } from '@angular/cdk/collections';

enum ActionId {
  BACK = '[@ng-atomic/components/templates/selection] Back',
  SUBMIT = '[@ng-atomic/components/templates/selection] Submit',
  TOGGLE_OPTION = '[@ng-atomic/components/templates/selection-list] Toggle Option',
}

@Component({
  selector: 'templates-selection',
  standalone: true,
  imports: [
    CommonModule,
    ScrollFrame,
    NavigatorOrganism,
    HeaderMolecule,
    SelectionListOrganism,
    ActionButtonsSectionOrganism,
  ],
  template: `
  <frames-scroll>
    <organisms-navigator 
      [startActions]="navStartActions"
      [endActions]="navEndActions"
      (action)="dispatch($event)"
      top
    >
      <molecules-header [title]="title"></molecules-header>
    </organisms-navigator>
    <organisms-selection-list
      [items]="items"
      [itemActions]="itemActions"
      [selection]="selection"
      (action)="dispatch($event)"
      contents
    ></organisms-selection-list>
    <organisms-action-buttons-section
      [actions]="actions"
      (action)="dispatch($event)"
      bottom
    ></organisms-action-buttons-section>
  </frames-scroll>
  `,
  styleUrls: ['./selection.template.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'template' },
})
export class SelectionTemplate<T> extends NgAtomicComponent {
  static ActionId = ActionId;

  @Input()
  navStartActions: Action[] = [
    {
      id: ActionId.BACK,
      icon: 'arrow_back',
      name: 'Back',
    }
  ];

  @Input()
  navEndActions: Action[] = [];

  @Input()
  actions: Action[] = [
    {
      id: ActionId.SUBMIT,
      icon: 'check',
      name: 'Submit',
    },
  ];

  @Input()
  itemActions: (item: T) => Action[] = () => [];

  @Input()
  title: string = '';

  @Input()
  items: T[] = [];

  @Input()
  selection = new SelectionModel(false);

  @Effect(SelectionListOrganism.ActionId.TOGGLE_OPTION)
  protected toggleOption(item: T) {
    this.dispatch({
      id: ActionId.TOGGLE_OPTION,
      payload: item,
    });
  }

}
