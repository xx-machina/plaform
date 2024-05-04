import { ChangeDetectionStrategy, Component, ElementRef, Input, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { SmartMenuButtonAtom } from '@ng-atomic/components/atoms/smart-menu-button';
import { Effect, NgAtomicComponent } from '@ng-atomic/core';
import { ErrorPipe } from '@ng-atomic/common/pipes/error';

enum ActionId {
  FILE_SELECT_BUTTON_CLICK = '[@ng-atomic/components/molecules/file-input-field] File select button click',
  FILE_SELECTED = '[@ng-atomic/components/molecules/file-input-field] File selected',
  CANCEL = '[@ng-atomic/components/molecules/file-input-field] Cancel',
}

@Component({
  selector: 'molecules-file-input-field',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatInputModule,
    SmartMenuButtonAtom,
    ErrorPipe,
  ],
  template: `
  <mat-form-field [appearance]="appearance">
    <mat-label>{{ label }}</mat-label>
      <input matInput [name]="name" type="text" [formControl]="_control" [placeholder]="placeholder">
    <!-- <mat-icon matSuffix>sentiment_very_satisfied</mat-icon> -->
    <mat-hint *ngIf="progress">Uploading...({{ progress?.toFixed(2) }}%)</mat-hint>
    <mat-hint *ngIf="!progress && hint">{{ hint }}</mat-hint>
    <mat-error>{{ control.errors | error }}</mat-error>
  </mat-form-field>
  <atoms-smart-menu-button
    [actions]="actions"
    (action)="dispatch($event)"
  ></atoms-smart-menu-button>
  <input style="display: none" type="file" value="test" (change)="onFileSelected($event)" #fileUpload>
  `,
  styleUrls: ['./file-input-field.molecule.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FileInputFieldMolecule extends NgAtomicComponent {
  static ActionId = ActionId;
  
  protected get actions() {
    return this.progress ? [
      {
        id: ActionId.CANCEL,
        icon: 'cancel',
        name: 'Cancel',
        disabled: this.control.disabled,
      },
    ] : [
      {
        id: ActionId.FILE_SELECT_BUTTON_CLICK,
        icon: 'attach_file',
        name: 'Select file',
        disabled: this.control.disabled,
      },
    ];
  }

  @Input()
  appearance: 'outline' | 'fill' = 'outline';

  @Input()
  name?: string;

  @Input()
  label = 'label';

  @Input()
  control = new FormControl<string | number>('');

  protected _control = new FormControl<string | number>({value: '', disabled: true});

  @Input()
  placeholder = 'placeholder';

  @Input()
  hint?: string;

  @Input()
  progress?: number;

  @ViewChild('fileUpload', { static: true })
  protected fileUpload: ElementRef<HTMLInputElement>;

  ngOnInit() {
    this._control.setValidators(this.control['_rawValidators']);
    this._control.setAsyncValidators(this.control['_rawAsyncValidators']);
    this.control.valueChanges.subscribe(value => this._control.setValue(value));
  }

  @Effect(ActionId.FILE_SELECT_BUTTON_CLICK)
  protected onFileSelectButtonClick() {
    this.fileUpload.nativeElement.click();
  }

  protected onFileSelected(event: Event & {target: HTMLInputElement}) {
    this.dispatch({
      id: ActionId.FILE_SELECTED,
      payload: event.target.files,
    });
    this.fileUpload.nativeElement.value = '';
  }

}
