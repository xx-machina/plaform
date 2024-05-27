import { COMMA, ENTER, SPACE } from '@angular/cdk/keycodes';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, DestroyRef, Directive, inject, input } from '@angular/core';
import { MatChipInputEvent, MatChipsModule } from '@angular/material/chips';
import { MatFormFieldAppearance } from '@angular/material/form-field';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { ChipsManager } from '@ng-atomic/common/services/chips-manager';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { ErrorPipe } from '@ng-atomic/common/pipes/error';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { makeConfig } from '@ng-atomic/common/services/ui';
import { InjectableComponent, NgAtomicComponent, TokenizedType, _computed } from '@ng-atomic/core';

export interface ChipsInputMoleculeState {
  appearance: MatFormFieldAppearance;
  control: FormControl<string>;
  floatLabel: 'auto' | 'always' | 'never';
  label: string;
  hint: string;
  placeholder: string;
  separators: readonly (typeof ENTER | typeof COMMA | typeof SPACE)[];
}

@TokenizedType()
@Directive({ standalone: true, selector: 'molecules-chips-input-field' })
export class ChipsInputFieldMoleculeStore extends InjectableComponent {
  static readonly Config = makeConfig(() => {
    return () => ({
      appearance: 'outline',
      control: new FormControl<string>(''),
      floatLabel: 'auto',
      label: 'label',
      hint: 'hint',
      placeholder: 'placeholder',
      separators: [ENTER, COMMA, SPACE] as const,
    });
  }, ['components', 'molecules', 'chips-input-field']);
  protected readonly config = ChipsInputFieldMoleculeStore.Config.inject();

  readonly appearance = input(_computed(() => this.config().appearance));
  readonly control = input(_computed(() => this.config().control));
  readonly floatLabel = input(_computed(() => this.config().floatLabel));
  readonly label = input(_computed(() => this.config().label));
  readonly hint = input(_computed(() => this.config().hint));
  readonly placeholder = input(_computed(() => this.config().placeholder));
  readonly separators = input(_computed(() => this.config().separators));
}

@Component({
  selector: 'molecules-chips-input-field',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatChipsModule,
    MatIconModule,
    MatInputModule,
    ErrorPipe,
  ],
  template: `
  <mat-form-field [appearance]="store.appearance()" [floatLabel]="store.floatLabel()">
    <mat-label>{{ store.label() }}</mat-label>
    <mat-chip-grid #chipGrid>
      @for (chip of chipsManager.chips; track chip) {
        <mat-chip-row (removed)="remove(chip)" [editable]="false">
          {{ chip }}
          <button matChipRemove><mat-icon>cancel</mat-icon></button>
        </mat-chip-row>
      }
      <input
        matInput
        [placeholder]="store.placeholder()"
        [matChipInputFor]="chipGrid"
        [matChipInputSeparatorKeyCodes]="store.separators()"
        [matChipInputAddOnBlur]="true"
        (matChipInputTokenEnd)="onChiInputTokenEnd($event)"
      >
    </mat-chip-grid>
    @if (store.hint()) {
      <mat-hint>{{ store.hint() }}</mat-hint>
    }
    <mat-error>{{ store.control().errors | error }}</mat-error>
  </mat-form-field>
  `,
  styleUrls: ['./chips-input-field.molecule.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ChipsManager],
  hostDirectives: [
    {
      directive: ChipsInputFieldMoleculeStore,
      inputs: ['appearance', 'control', 'floatLabel', 'label', 'hint', 'placeholder', 'separators'],
    },
  ],
})
export class ChipsInputFieldMolecule extends NgAtomicComponent {
  private readonly destroyRef = inject(DestroyRef);
  private readonly cd = inject(ChangeDetectorRef);
  protected readonly chipsManager = inject(ChipsManager);
  protected store = inject(ChipsInputFieldMoleculeStore);

  ngOnInit(): void {
    this.chipsManager.setValue(this.store.control().value!);
    this.store.control().valueChanges.pipe(
      takeUntilDestroyed(this.destroyRef),
    ).subscribe((value) => {
      this.chipsManager.setValue(value!);
      this.cd.markForCheck();
    });
  }

  protected onChiInputTokenEnd(event: MatChipInputEvent): void {
    this.chipsManager.add(event.value);
    this.store.control().setValue(this.chipsManager.getValue());
    event.input.value = '';
  }

  protected remove(value: string): void {
    this.chipsManager.remove(value);
    this.store.control().setValue(this.chipsManager.getValue());
  }
}
