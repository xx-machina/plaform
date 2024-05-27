import { ClipboardModule } from '@angular/cdk/clipboard';
import { CdkCellDef, CdkColumnDef, CdkHeaderCellDef, CdkTable } from '@angular/cdk/table';
import { ChangeDetectionStrategy, Output, EventEmitter, Component, ViewEncapsulation, Directive, input, signal, inject, effect, viewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DataAccessorPipe } from '@ng-atomic/common/pipes/data-accessor';
import { SmartExpModule } from '@ng-atomic/common/pipes/smart-exp';
import { NgAtomicComponent } from '@ng-atomic/core';

@Directive({ standalone: true })
export class SmartColumnTemplateStore<T> {
  readonly sort = input<'asc' | 'desc' | 'none'>('none');
  readonly tooltipText = signal('copy');
}

@Component({
  selector: 'molecules-smart-column',
  standalone: true,
  imports: [
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
      <p
        class="nowrap"
        style="display: flex; align-items: center;"
      >
        <span>{{ headerText() }}</span>
        @switch(store.sort()) {
          @case('asc') {
            <mat-icon class="order">south</mat-icon>
          }
          @case('desc') {
            <mat-icon class="order">north</mat-icon>
          }
        }
      </p>
    </th>
    <td
      mat-cell
      *matCellDef="let item"
      [style.text-align]="justify"
    >
      <p class="nowrap"
        [cdkCopyToClipboard]="item | dataAccessor: name() | smartExp: name()"
        (click)="copied(); tooltip.show()"
        #tooltip="matTooltip" [matTooltip]="store.tooltipText()" matTooltipPosition="below"
      >
        {{ item | dataAccessor: name() | smartExp: name() }}
      </p>
    </td>
  </ng-container>
  `,
  styleUrls: ['./smart-column.molecule.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  hostDirectives: [
    {
      directive: SmartColumnTemplateStore,
      inputs: ['sort'],
    },
  ],
})
export class SmartColumnMolecule<T> extends NgAtomicComponent {
  protected store = inject(SmartColumnTemplateStore);
  private _table = inject(CdkTable, {optional: true});
  readonly headerText = input<string>('');
  readonly name = input.required<string>();
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

  @Output() headerClick = new EventEmitter<void>();

  protected copied() {
    this.store.tooltipText.set('copied!');
    setTimeout(() => this.store.tooltipText.set('copy'), 1000);
  }
}
