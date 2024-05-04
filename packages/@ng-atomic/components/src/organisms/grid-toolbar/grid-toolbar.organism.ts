import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { TextInputFieldMolecule } from '@ng-atomic/components/molecules/text-input-field';
import { SelectInputFieldMolecule } from '@ng-atomic/components/molecules/select-input-field';
import { AutoLayoutFrame } from '@ng-atomic/components/frames/auto-layout';

@Component({
  selector: 'organisms-grid-toolbar',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
  ],
  template: `
    <button
      mat-button
      color="basic"
      [matMenuTriggerFor]="menu"
    >Filters</button>
    <button
      mat-button
      color="basic"
    >Export</button>
    <mat-menu #menu="matMenu" style="width: fit-content;">
      
    </mat-menu>
  `,
  styleUrls: ['./grid-toolbar.organism.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GridToolbarOrganism {
  @Input()
  form = new FormGroup({
    filters: new FormArray([
      new FormGroup({
        column: new FormControl(''),
        operator: new FormControl(''),
        value: new FormControl(''),
      }),
    ]),
  });

  @Input()
  columns: string[] = [];

  get columnOptions() {
    return this.columns.map(column => ({name: column, value: column}));
  }

}
