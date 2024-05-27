import { CdkCellDef, CdkColumnDef, CdkHeaderCellDef, CdkTable } from '@angular/cdk/table';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Directive, ViewEncapsulation, effect, inject, input, viewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTableModule } from '@angular/material/table';
import { Actions, InjectableComponent, NgAtomicComponent } from '@ng-atomic/core';
import { ActionsPipe } from '@ng-atomic/common/pipes/actions';
import { SmartMenuButtonAtom } from '@ng-atomic/components/atoms/smart-menu-button';

@Directive({ standalone: true })
export class ActionsColumnMoleculeStore extends InjectableComponent {
  readonly headerText = input<string>('');
  readonly name = input.required<string>();
  readonly itemActions = input<Actions>([]);
}

@Component({
  selector: 'molecules-actions-column',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatMenuModule,
    MatButtonModule,
    MatIconModule,
    SmartMenuButtonAtom,
    ActionsPipe,
  ],
  template: `
  <ng-container matColumnDef>
    <th mat-header-cell *matHeaderCellDef>{{ store.headerText() }}</th>
    <td mat-cell *matCellDef="let item">
      <atoms-smart-menu-button
        [actions]="store.itemActions() | resolveActions:item"
        (action)="dispatch({id: $event.id, payload: item})"
      />
    </td>
  </ng-container>
  `,
  styleUrls: ['./actions-column.molecule.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  hostDirectives: [
    {
      directive: ActionsColumnMoleculeStore,
      inputs: ['headerText', 'name', 'itemActions'],
    },
  ],
})
export class ActionsColumnMolecule<T> extends NgAtomicComponent {
  private _table = inject(CdkTable, {optional: true});
  protected store = inject(ActionsColumnMoleculeStore);
  readonly columnDef = viewChild.required(CdkColumnDef);
  readonly cell = viewChild.required(CdkCellDef);
  readonly headerCell = viewChild.required(CdkHeaderCellDef);

  constructor() {
    super();
    effect(() => {
      if (this.columnDef()) this.columnDef().name = this.store.name();
    })
  }

  ngOnInit() {
    if (this._table) {
      this.columnDef().name = this.store.name();
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
}
