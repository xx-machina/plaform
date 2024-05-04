import { COMMA, ENTER, SPACE } from '@angular/cdk/keycodes';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input } from '@angular/core';
import { MatChipInputEvent, MatChipsModule } from '@angular/material/chips';
import { MatFormFieldAppearance, MatFormFieldModule } from '@angular/material/form-field';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { ReplaySubject, takeUntil } from 'rxjs';
import { ChipsManager } from '@ng-atomic/common/services/chips-manager';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { ChipsInputAtom } from '@ng-atomic/components/atoms/chips-input';
import { ErrorPipe } from '@ng-atomic/common/pipes/error';


@Component({
  selector: 'molecules-chips-input-field',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatChipsModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    ChipsInputAtom,
    ErrorPipe,
  ],
  template: `
  <mat-form-field [appearance]="appearance" [floatLabel]="floatLabel">
    <mat-label>{{ label }}</mat-label>
    <mat-chip-grid #chipGrid>
      <mat-chip-row *ngFor="let chip of chipsManager.chips"
        (removed)="remove(chip)"
        [editable]="false"
      >
        {{ chip }}
        <button matChipRemove><mat-icon>cancel</mat-icon></button>
      </mat-chip-row>
      <input
        matInput
        [placeholder]="placeholder"
        [matChipInputFor]="chipGrid"
        [matChipInputSeparatorKeyCodes]="separators"
        [matChipInputAddOnBlur]="true"
        (matChipInputTokenEnd)="onChiInputTokenEnd($event)"
      >
    </mat-chip-grid>
    <mat-hint *ngIf="hint">{{ hint }}</mat-hint>
    <mat-error>{{ control.errors | error }}</mat-error>
  </mat-form-field>
  `,
  styleUrls: ['./chips-input-field.molecule.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ChipsManager],
})
export class ChipsInputFieldMolecule {

  @Input()
  appearance: MatFormFieldAppearance = 'outline';

  @Input()
  control = new FormControl<string>('');

  @Input()
  floatLabel = 'auto';

  @Input()
  label = 'label';

  @Input()
  hint = 'hint';

  @Input()
  placeholder = 'placeholder';

  @Input()
  separators = [ENTER, COMMA, SPACE] as const;

  private readonly destroy$ = new ReplaySubject<void>(1);

  constructor(
    private cd: ChangeDetectorRef,
    public chipsManager: ChipsManager,
  ) { }

  ngOnInit(): void {
    this.chipsManager.setValue(this.control.value!);
    this.control.valueChanges.pipe(
      takeUntil(this.destroy$),
    ).subscribe((value) => {
      this.chipsManager.setValue(value!);
      this.cd.markForCheck();
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
  }

  onChiInputTokenEnd(event: MatChipInputEvent): void {
    this.chipsManager.add(event.value);
    this.control.setValue(this.chipsManager.getValue());
    event.input.value = '';
  }

  remove(value: string): void {
    this.chipsManager.remove(value);
    this.control.setValue(this.chipsManager.getValue());
  }
}
