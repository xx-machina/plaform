import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FileInputFieldMolecule } from '@ng-atomic/components/molecules/file-input-field';
import { Effect, NgAtomicComponent } from '@ng-atomic/core';
import { FormControl } from '@angular/forms';

enum ActionId {
  FILE_SELECTED = '[@ng-atomic/components/organisms/file-input-section] File selected',
  CANCEL = '[@ng-atomic/components/organisms/file-input-section] Cancel',
}

@Component({
  selector: 'organisms-file-input-section',
  standalone: true,
  imports: [
    CommonModule,
    FileInputFieldMolecule,
  ],
  template: `
  <molecules-file-input-field
    [control]="control"
    [label]="label"
    [hint]="hint"
    [progress]="progress"
    [placeholder]="placeholder"
    (action)="dispatch($event)"
  ></molecules-file-input-field>
  `,
  styleUrls: ['./file-input-section.organism.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FileInputSectionOrganism extends NgAtomicComponent {
  static ActionId = ActionId;

  @Input() control = new FormControl({value: null, disabled: true});
  @Input() label = 'label';
  @Input() placeholder = 'placeholder';
  @Input() hint?: string;
  @Input() progress?: number;

  @Effect(FileInputFieldMolecule.ActionId.FILE_SELECTED)
  protected onFileSelected(files: File[]) {
    this.dispatch({id: ActionId.FILE_SELECTED, payload: files});
  }

  @Effect(FileInputFieldMolecule.ActionId.CANCEL)
  protected onCancel() {
    this.dispatch({id: ActionId.CANCEL});
  }
}
