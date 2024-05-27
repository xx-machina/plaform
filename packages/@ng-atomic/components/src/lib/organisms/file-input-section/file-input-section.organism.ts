import { ChangeDetectionStrategy, Component, Directive, effect, inject, input } from '@angular/core';
import { FileInputFieldMolecule } from '@ng-atomic/components/molecules/file-input-field';
import { Effect, InjectableComponent, NgAtomicComponent, TokenizedType } from '@ng-atomic/core';
import { FormControl } from '@angular/forms';

enum ActionId {
  FILE_SELECTED = '[@ng-atomic/components/organisms/file-input-section] File selected',
  CANCEL = '[@ng-atomic/components/organisms/file-input-section] Cancel',
}

@TokenizedType()
@Directive({ standalone: true, selector: 'organisms-file-input-section' })
export class FileInputSectionOrganismStore extends InjectableComponent {
  readonly control = input(new FormControl(null));
  readonly label = input('label');
  readonly placeholder = input('placeholder');
  readonly hint = input<string | null>(null);
  readonly progress = input<number | false>(false);

  constructor() {
    super();
    effect(() => {
      console.debug('FileInputSectionOrganismStore#progress:', this.progress());
    });
  }
}

@Component({
  selector: 'organisms-file-input-section',
  standalone: true,
  imports: [
    FileInputFieldMolecule,
  ],
  template: `
  <molecules-file-input-field
    [control]="store.control()"
    [label]="store.label()"
    [hint]="store.hint()"
    [progress]="store.progress()"
    [placeholder]="store.placeholder()"
    (action)="dispatch($event)"
  />
  `,
  styleUrls: ['./file-input-section.organism.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  hostDirectives: [
    {
      directive: FileInputSectionOrganismStore,
      inputs: ['control', 'label', 'placeholder', 'hint', 'progress'],
    }
  ],
})
export class FileInputSectionOrganism extends NgAtomicComponent {
  static ActionId = ActionId;
  protected store = inject(FileInputSectionOrganismStore);

  @Effect(FileInputFieldMolecule.ActionId.FILE_SELECTED)
  protected onFileSelected(files: File[]) {
    this.dispatch({id: ActionId.FILE_SELECTED, payload: files});
  }

  @Effect(FileInputFieldMolecule.ActionId.CANCEL)
  protected onCancel() {
    this.dispatch({id: ActionId.CANCEL});
  }
}
