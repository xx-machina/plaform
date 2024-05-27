import { ChangeDetectionStrategy, Component, Directive, input, inject } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Action, InjectableComponent, NgAtomicComponent, TokenizedType } from '@ng-atomic/core';
import { TextareaFieldMolecule } from '@ng-atomic/components/molecules/textarea-field';
import { SmartMenuButtonAtom } from '@ng-atomic/components/atoms/smart-menu-button';

@TokenizedType()
@Directive({ standalone: true, selector: 'organisms-textarea-section' })
export class TextareaSectionOrganismStore extends InjectableComponent {
  readonly appearance = input<'legacy' | 'standard' | 'fill' | 'outline'>('outline');
  readonly label = input('label');
  readonly rows = input(10);
  readonly placeholder = input<string>('placeholder');
  readonly floatLabel = input<'auto' | 'always' | 'never'>('auto');
  readonly hint = input<string>();
  readonly control = input(new FormControl(''));
  readonly actions = input<Action[]>([]);
}

@Component({
  selector: 'organisms-textarea-section',
  standalone: true,
  imports: [
    TextareaFieldMolecule,
    SmartMenuButtonAtom,
  ],
  template: `
  <molecules-textarea-field
    [appearance]="store.appearance()"
    [control]="store.control()"
    [label]="store.label()"
    [floatLabel]="store.floatLabel()"
    [hint]="store.hint()"
    [rows]="store.rows()"
    [placeholder]="store.placeholder()"
    (action)="dispatch($event)"
  />
  @if (store.actions().length) {
    <atoms-smart-menu-button
      [actions]="store.actions()"
      (action)="dispatch($event)"
    />
  }
  `,
  styleUrls: ['./textarea-section.organism.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  hostDirectives: [
    {
      directive: TextareaSectionOrganismStore,
      inputs: ['appearance', 'label', 'rows', 'placeholder', 'floatLabel', 'hint', 'control', 'actions'],
    }
  ],
})
export class TextareaSectionOrganism extends NgAtomicComponent {
  protected store = inject(TextareaSectionOrganismStore);
}
