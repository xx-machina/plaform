import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
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
      [length]="(form.get(['length']).valueChanges | async) ?? form.get(['length']).value"
      [pageSize]="(form.get(['pageSize']).valueChanges | async) ?? form.get(['pageSize']).value"
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
  form = new FormGroup({
    pageIndex: new FormControl(0),
    pageSize: new FormControl(0),
    length: new FormControl(0),
  });

  @Input()
  pageSizeOptions: number[] = [10, 50, 100];

  protected onPageChange(page: PageEvent) {
    this.form.patchValue({
      pageIndex: page.pageIndex,
      pageSize: page.pageSize,
      length: page.length,
    });
  }

}
