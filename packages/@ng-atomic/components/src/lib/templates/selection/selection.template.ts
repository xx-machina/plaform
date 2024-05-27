import { ChangeDetectionStrategy, Component, Directive, inject, input } from '@angular/core';
import { ScrollFrame } from '@ng-atomic/components/frames/scroll-v2';
import { HeaderMolecule } from '@ng-atomic/components/molecules/header';
import { NavigatorOrganism } from '@ng-atomic/components/organisms/navigator';
import { Action, Actions, InjectableComponent } from '@ng-atomic/core';
import { Effect, NgAtomicComponent } from '@ng-atomic/core';
import { SelectionListOrganism } from '@ng-atomic/components/organisms/selection-list';
import { ActionButtonsSectionOrganism } from '@ng-atomic/components/organisms/action-buttons-section';
import { SelectionModel } from '@angular/cdk/collections';

enum ActionId {
  BACK = '[@ng-atomic/components/templates/selection] Back',
  SUBMIT = '[@ng-atomic/components/templates/selection] Submit',
  TOGGLE_OPTION = '[@ng-atomic/components/templates/selection-list] Toggle Option',
}

@Directive({standalone: true, selector: 'templates-selection'})
export class SelectionTemplateStore<T> extends InjectableComponent {
  readonly navStartActions = input<Action[]>([
    { id: ActionId.BACK, icon: 'arrow_back', name: 'Back' },
  ]);

  readonly navEndActions = input<Action[]>([]);
  readonly actions = input<Action[]>([
    { id: ActionId.SUBMIT, icon: 'check', name: 'Submit', color: 'primary' },
  ]);
  readonly itemActions = input<Actions>(() => []);
  readonly title = input<string>('');
  readonly items = input<T[]>([]);
  readonly selection = input(new SelectionModel(false));
}

@Component({
  selector: 'templates-selection',
  standalone: true,
  imports: [
    ScrollFrame,
    NavigatorOrganism,
    HeaderMolecule,
    SelectionListOrganism,
    ActionButtonsSectionOrganism,
  ],
  template: `
  <frames-scroll>
    <organisms-navigator 
      [startActions]="store.navStartActions()"
      [endActions]="store.navEndActions()"
      (action)="dispatch($event)"
      top
    >
      <molecules-header [title]="store.title()" />
    </organisms-navigator>
    <organisms-selection-list
      [items]="store.items()"
      [itemActions]="store.itemActions()"
      [selection]="store.selection()"
      (action)="dispatch($event)"
      contents
    />
    <organisms-action-buttons-section
      [actions]="store.actions()"
      (action)="dispatch($event)"
      bottom
    />
  </frames-scroll>
  `,
  styleUrls: ['./selection.template.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  hostDirectives: [
    {
      directive: SelectionTemplateStore,
      inputs: ['navStartActions', 'navEndActions', 'actions', 'itemActions', 'title', 'items', 'selection'],
    },
  ],
  host: { class: 'template' },
})
export class SelectionTemplate<T> extends NgAtomicComponent {
  static ActionId = ActionId;
  protected store = inject(SelectionTemplateStore);

  @Effect(SelectionListOrganism.ActionId.TOGGLE_OPTION)
  protected toggleOption(item: T) {
    this.dispatch({ id: ActionId.TOGGLE_OPTION, payload: item });
  }

}
