import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { LegacyPageEvent as PageEvent } from '@angular/material/legacy-paginator';
import { FormControl, FormGroup } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatPaginatorModule } from '@angular/material/paginator';

@Component({
  selector: 'organisms-paginator',
  standalone: true,
  imports: [
    CommonModule,
    MatPaginatorModule,
  ],
  template: `
    <mat-paginator
      [length]="page.length"
      [pageSize]="page.pageSize"
      [pageSizeOptions]="pageSizeOptions"
      (page)="onPageChange($event)"
      aria-label="Select page">
    </mat-paginator>
  `,
  styleUrls: ['./paginator.organism.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {class: 'organism'},
})
export class PaginatorOrganism {

  @Input()
  control = new FormControl<string>('');

  @Input()
  form = new FormGroup({
    pageIndex: new FormControl(0),
    pageSize: new FormControl(0),
    length: new FormControl(0),
  });

  @Input()
  placeholder = '';

  @Input()
  page!: PageEvent;

  @Input()
  pageSizeOptions: number[] = [5, 10, 25, 100];

  @Output()
  pageChange = new EventEmitter<PageEvent>();

  protected onPageChange(page: PageEvent) {
    this.form.patchValue({
      pageIndex: page.pageIndex,
      pageSize: page.pageSize,
      length: page.length,
    });
  }

}
