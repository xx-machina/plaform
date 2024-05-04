import { ClipboardModule } from '@angular/cdk/clipboard';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Input, Output, EventEmitter, Component, ViewEncapsulation } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule, MatTextColumn } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DataAccessorPipe } from '@ng-atomic/common/pipes/data-accessor';
import { SmartExpModule } from '@ng-atomic/common/pipes/smart-exp';

@Component({
  selector: 'molecules-smart-column',
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
  templateUrl: './smart-column.molecule.html',
  styleUrls: ['./smart-column.molecule.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SmartColumnMolecule<T> extends MatTextColumn<T> {

  @Input()
  sort: 'asc' | 'desc' | 'none' = 'none';

  @Output()
  headerClick = new EventEmitter<void>();

  text = 'copy';

  copied() {
    this.text = 'copied!';
    setTimeout(() => this.text = 'copy', 1000);
  }
}
