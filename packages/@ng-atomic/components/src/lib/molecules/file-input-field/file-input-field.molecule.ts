import { ChangeDetectionStrategy, Component, Directive, ElementRef, computed, effect, inject, input, viewChild } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { SmartMenuButtonAtom } from '@ng-atomic/components/atoms/smart-menu-button';
import { Effect, NgAtomicComponent } from '@ng-atomic/core';
import { ErrorPipe } from '@ng-atomic/common/pipes/error';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { startWith, switchMap } from 'rxjs';

enum ActionId {
  FILE_SELECT_BUTTON_CLICK = '[@ng-atomic/components/molecules/file-input-field] File select button click',
  FILE_SELECTED = '[@ng-atomic/components/molecules/file-input-field] File selected',
  CANCEL = '[@ng-atomic/components/molecules/file-input-field] Cancel',
}

@Directive({ standalone: true })
export class FileInputFieldStore {
  readonly control = input(new FormControl(null));
  readonly control$ = toObservable(this.control).pipe(takeUntilDestroyed());
  readonly controlValue$ = this.control$.pipe(
    switchMap(control => control.valueChanges.pipe(startWith(control.value))),
  );
  readonly label = input('label');
  readonly placeholder = input('placeholder');
  readonly hint = input<string | null>(null);
  readonly progress = input<number | false>(false);
  readonly name = input<string | null>(null);
  readonly appearance = input<'outline' | 'fill'>('outline');
  readonly _control = new FormControl<string | number>({value: '', disabled: true});

  constructor() {
    // super();
    effect(() => {
      console.debug('progress:', this.progress());
    });
  }

  ngOnInit() {
    // super.ngOnInit();
    this.control$.subscribe(control => {
      this._control.setValidators(control['_rawValidators']);
      this._control.setAsyncValidators(control['_rawAsyncValidators']);
    });

    this.controlValue$.subscribe(value => this._control.setValue(value));
  }

  readonly actions = computed(() => {
    if (this.progress()) {
      return [
        {
          id: ActionId.CANCEL,
          icon: 'cancel',
          name: 'Cancel',
          disabled: this.control().disabled,
        },
      ];
    } else {
      return [
        {
          id: ActionId.FILE_SELECT_BUTTON_CLICK,
          icon: 'attach_file',
          name: 'Select file',
          disabled: this.control().disabled,
        },
      ];
    }
  });
}

@Component({
  selector: 'molecules-file-input-field',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatInputModule,
    SmartMenuButtonAtom,
    ErrorPipe,
  ],
  template: `
  <mat-form-field [appearance]="store.appearance()">
    <mat-label>{{ store.label() }}</mat-label>
      <input matInput [name]="store.name()" type="text" [formControl]="store._control" [placeholder]="store.placeholder()">
    <!-- <mat-icon matSuffix>sentiment_very_satisfied</mat-icon> -->
    @if (store.progress()) {
      <mat-hint>Uploading...({{ store.progress() ? store.progress()?.toFixed(2) : '' }}%)</mat-hint>
    } @else if (store.hint()) {
      <mat-hint>{{ store.hint() }}</mat-hint>
    }
    <mat-error>{{ store.control().errors | error }}</mat-error>
  </mat-form-field>
  <atoms-smart-menu-button
    [actions]="store.actions()"
    (action)="dispatch($event)"
  ></atoms-smart-menu-button>
  <input style="display: none" type="file" (change)="onFileSelected($event)" #fileUpload>
  `,
  styleUrls: ['./file-input-field.molecule.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  hostDirectives: [
    {
      directive: FileInputFieldStore,
      inputs: ['control', 'label', 'placeholder', 'hint', 'progress', 'name', 'appearance'],
    }
  ]
})
export class FileInputFieldMolecule extends NgAtomicComponent {
  static readonly ActionId = ActionId;
  protected readonly store = inject(FileInputFieldStore);
  protected readonly fileUpload = viewChild.required<ElementRef<HTMLInputElement>>('fileUpload');
  
  @Effect(ActionId.FILE_SELECT_BUTTON_CLICK)
  protected onFileSelectButtonClick() {
    this.fileUpload().nativeElement.click();
  }

  protected onFileSelected(event: Event & {target: HTMLInputElement}) {
    this.dispatch({id: ActionId.FILE_SELECTED, payload: event.target.files});
    // this.fileUpload().nativeElement.value = '';
  }

}
