import { SelectionModel } from '@angular/cdk/collections';
import { CdkCellDef, CdkColumnDef, CdkHeaderCellDef, CdkTable } from '@angular/cdk/table';
import { ChangeDetectionStrategy, Component, EventEmitter, Output, SimpleChanges, ViewEncapsulation, effect, inject, input, viewChild } from '@angular/core';
import { MAT_CHECKBOX_DEFAULT_OPTIONS, MatCheckboxDefaultOptions, MatCheckboxModule } from '@angular/material/checkbox';
import { MatTableModule } from '@angular/material/table';
import { SelectIdPipe } from '@ng-atomic/common/pipes/select-id';
import { NgAtomicComponent } from '@ng-atomic/core';

enum ActionId {
  CHECKBOX_CLICK = '[@ng-atomic/components/molecules/checkbox-column] Checkbox Click',
}

@Component({
  selector: 'molecules-checkbox-column',
  standalone: true,
  imports: [
    MatTableModule,
    MatCheckboxModule,
    SelectIdPipe,
  ],
  template: `
  <ng-container matColumnDef>
    <th mat-header-cell *matHeaderCellDef></th>
    <td mat-cell *matCellDef="let item">
      @if (isHidden()(item)) {
        <mat-checkbox
          (click)="onCheckboxClick(item, $event)"
          [checked]="selection().isSelected(item | selectId)"
        />
      }
    </td>
  </ng-container>`,
  styleUrls: ['./checkbox-column.molecule.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {provide: MAT_CHECKBOX_DEFAULT_OPTIONS, useValue: { clickAction: 'noop' } as MatCheckboxDefaultOptions}
  ],
})
export class CheckboxColumnMolecule<T> extends NgAtomicComponent {
  static readonly ActionId = ActionId;
  private _table = inject(CdkTable<T>, {optional: true});
  readonly name = input.required<string>();
  readonly selection = input(new SelectionModel<string>(true, []));
  readonly isHidden = input((item: T) => true);
  readonly columnDef = viewChild.required(CdkColumnDef);
  readonly cell = viewChild.required(CdkCellDef);
  readonly headerCell = viewChild.required(CdkHeaderCellDef);

  constructor() {
    super();
    effect(() => {
      if (this.columnDef()) this.columnDef().name = this.name();
    })
  }

  ngOnInit() {
    if (this._table) {
      this.columnDef().name = this.name();
      this.columnDef().cell = this.cell();
      this.columnDef().headerCell = this.headerCell();
      this._table.addColumnDef(this.columnDef());
    }
  }

  ngOnDestroy() {
    if (this._table) {
      this._table.removeColumnDef(this.columnDef());
    }
  }

  protected onCheckboxClick(item: T, event: Event) {
    this.dispatch({id: ActionId.CHECKBOX_CLICK, payload: item});
  }
}
