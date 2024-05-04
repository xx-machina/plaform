import { COMMA, ENTER, SPACE } from '@angular/cdk/keycodes';
import { Component, OnInit, ChangeDetectionStrategy, Input, ChangeDetectorRef } from '@angular/core';
import { MatChipInputEvent, MatChipsModule } from '@angular/material/chips';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { ReplaySubject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ChipsManager } from '@ng-atomic/common/services/chips-manager';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';


@Component({
  selector: 'atoms-chips-input',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatChipsModule,
    MatIconModule,
    MatInputModule,
  ],
  template: `
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
  `,
  styleUrls: ['./chips-input.atom.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ChipsManager],
})
export class ChipsInputAtom implements OnInit {
  private readonly destroy$ = new ReplaySubject<void>(1);

  @Input()
  separators = [ENTER, COMMA, SPACE] as const;

  @Input()
  control = new FormControl<string>('');

  @Input()
  placeholder = '';

  constructor(
    private cd: ChangeDetectorRef,
    public chipsManager: ChipsManager,
  ) { }

  ngOnInit(): void {
    this.chipsManager.setValue(this.control.value);
    this.control.valueChanges.pipe(takeUntil(this.destroy$)).subscribe((value) => {
      this.chipsManager.setValue(value);
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
