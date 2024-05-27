import { ChangeDetectionStrategy, Component, Directive, EventEmitter, Input, Output, ViewEncapsulation, inject, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule, MatTextColumn } from '@angular/material/table';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { SmartExpModule } from '@ng-atomic/common/pipes/smart-exp';
import { DataAccessorPipe } from '@ng-atomic/common/pipes/data-accessor';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FlatTreeControl } from '@angular/cdk/tree';

@Directive({standalone: true, selector: 'molecules-tree-column'})
export class TreeColumnMoleculeStore {
  readonly sort = input<'asc' | 'desc' | 'none'>('none');
  readonly treeControl = input(new FlatTreeControl<any>(
    (node) => node.level,
    (node) => node.isExpandable
  ));

}

@Component({
  selector: 'molecules-tree-column',
  standalone: true,
  imports: [
    CommonModule,
    ClipboardModule,
    SmartExpModule,
    DataAccessorPipe,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatTooltipModule,
  ],
  template: `
  <ng-container matColumnDef>
    <th
      mat-header-cell
      *matHeaderCellDef
      [style.text-align]="justify"
      (click)="headerClick.emit()"
    >
      <p class="nowrap" style="display: flex; align-items: center; margin-left: 48px">
        <span>{{ key }}</span>
        @switch(store.sort()) {
          @case ('asc') {
            <mat-icon class="order">south</mat-icon>
          }
          @case ('desc') { 
            <mat-icon class="order">north</mat-icon>
          }
        }
      </p>
    </th>
    <td mat-cell *matCellDef="let data"> 
      <p class="nowrap"
        [cdkCopyToClipboard]="data | dataAccessor: key | smartExp: key"
        (click)="copied(); tooltip.show()"
        #tooltip="matTooltip" [matTooltip]="text" matTooltipPosition="below"
      >
        <button 
          mat-icon-button 
          [style.visibility]="!data.isExpandable ? 'hidden' : ''"
          [style.marginLeft.px]="data.level * 32"
          (click)="store.treeControl().toggle(data)"
        >
          <mat-icon>
            {{ store.treeControl().isExpanded(data) ? 'expand_more' : 'chevron_right' }}
          </mat-icon>
        </button>
        <span> {{ data | dataAccessor: key }} </span>
      </p>
    </td>
  </ng-container> `,
  styleUrls: ['./tree-column.molecule.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  hostDirectives: [
    {
      directive: TreeColumnMoleculeStore,
      inputs: ['sort', 'treeControl'],
    }
  ],
})
export class TreeColumnMolecule<T> extends MatTextColumn<T> {
  protected store = inject(TreeColumnMoleculeStore);

  @Output()
  headerClick = new EventEmitter<void>();

  text = 'copy';

  get key() {
    return this.name.slice('__tree_'.length);
  }

  copied() {
    this.text = 'copied!';
    setTimeout(() => this.text = 'copy', 1000);
  }
}
