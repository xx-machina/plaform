import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AutoLayoutFrame } from '@ng-atomic/components/frames/auto-layout';
import { TextInputFieldMolecule } from '@ng-atomic/components/molecules/text-input-field';
import { SelectInputFieldMolecule } from '@ng-atomic/components/molecules/select-input-field';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { NgAtomicComponent } from '@ng-atomic/core';

@Component({
  selector: 'organisms-filters-section',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    AutoLayoutFrame,
    TextInputFieldMolecule,
    SelectInputFieldMolecule,
  ],
  template: `
    <frames-auto-layout
      vertical
      style="width: fit-content;"
    >
      <frames-auto-layout
        *ngFor="let filter of form.controls; index as i"
        horizontal
        style="width: fit-content;"
      >
        <button mat-icon-button (click)="removeFilter(i)" [disabled]="!modifiable">
          <mat-icon> close </mat-icon>
        </button>
        <molecules-select-input-field
          [appearance]="'fill'"
          [label]="'Column'"
          [options]="columnOptions"
          [control]="filter.get('column')"
        ></molecules-select-input-field>
        <molecules-select-input-field
          [appearance]="'fill'"
          [label]="'Operator'"
          [options]="[{name: 'equals', value: 'equals'}, {name: 'not in', value: 'not in'}]"
          [control]="filter.get('operator')"
        ></molecules-select-input-field>
        <molecules-text-input-field
          [appearance]="'fill'"
          [label]="'Value'"
          [control]="filter.get('value')"
        ></molecules-text-input-field>
      </frames-auto-layout>
      <button (click)="addFilter()" [disabled]="!modifiable" mat-button>Add Filter</button>
    </frames-auto-layout>
  `,
  styleUrls: ['./filters-section.organism.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FiltersSectionOrganism extends NgAtomicComponent {
  @Input()
  modifiable = true;

  @Input()
  form = new FormArray([
    new FormGroup({
      column: new FormControl(''),
      operator: new FormControl(''),
      value: new FormControl(''),
    }),
    new FormGroup({
      column: new FormControl(''),
      operator: new FormControl(''),
      value: new FormControl(''),
    }),
  ]);

  @Input()
  columns: string[] = [];

  get columnOptions() {
    return this.columns.map(column => ({name: column, value: column}));
  }

  protected addFilter() {
    this.form.push(new FormGroup({
      column: new FormControl(''),
      operator: new FormControl(''),
      value: new FormControl(''),
    }));
  }

  protected removeFilter(i: number) {
    this.form.removeAt(i);
  }
}
