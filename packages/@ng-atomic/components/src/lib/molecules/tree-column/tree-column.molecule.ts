import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule, MatTextColumn } from '@angular/material/table';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { SmartExpModule } from '@ng-atomic/common/pipes/smart-exp';
import { DataAccessorPipe } from '@ng-atomic/common/pipes/data-accessor';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FlatTreeControl } from '@angular/cdk/tree';

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
        <ng-container [ngSwitch]="sort">
          <mat-icon class="order" *ngSwitchCase="'asc'">south</mat-icon>
          <mat-icon class="order" *ngSwitchCase="'desc'">north</mat-icon>
        </ng-container>
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
          (click)="treeControl.toggle(data)"
        >
          <mat-icon>
            {{ treeControl.isExpanded(data) ? 'expand_more' : 'chevron_right' }}
          </mat-icon>
        </button>
        <span> {{ data | dataAccessor: key }} </span>
      </p>
    </td>
  </ng-container> `,
  styleUrls: ['./tree-column.molecule.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TreeColumnMolecule<T> extends MatTextColumn<T> {

  @Input()
  sort: 'asc' | 'desc' | 'none' = 'none';

  @Output()
  headerClick = new EventEmitter<void>();

  // @Input()
  // override dataAccessor = (data, name) => data[name.replace(/^__tree_/, '')] ?? '';

  text = 'copy';

  get key() {
    return this.name.slice('__tree_'.length);
  }

  copied() {
    this.text = 'copied!';
    setTimeout(() => this.text = 'copy', 1000);
  }

  @Input()
  treeControl = new FlatTreeControl<any>(
    (node) => node.level,
    (node) => node.isExpandable
  );

}
