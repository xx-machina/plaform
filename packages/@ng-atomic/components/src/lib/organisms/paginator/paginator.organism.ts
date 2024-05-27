import { ChangeDetectionStrategy, Component, Directive, effect, inject, input } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { FormControl, FormGroup } from '@angular/forms';
import { MatPaginatorModule } from '@angular/material/paginator';
import { InjectableComponent, NgAtomicComponent, TokenizedType } from '@ng-atomic/core';
import { computedRawValue } from '@ng-atomic/common/utils';

@TokenizedType()
@Directive({standalone: true, selector: 'organisms-paginator'})
export class PaginatorOrganismStore extends InjectableComponent {
  readonly form = input(new FormGroup({
    pageIndex: new FormControl(0),
    pageSize: new FormControl(0),
  }));
  readonly pageSizeOptions = input([10, 50, 100]);
  readonly itemLength = input(0);
  readonly formValue = computedRawValue(() => this.form());
}

@Component({
  selector: 'organisms-paginator',
  standalone: true,
  imports: [
    MatPaginatorModule,
  ],
  template: `
    <mat-paginator
      [length]="store.itemLength()"
      [pageSize]="store.formValue().pageSize"
      [pageSizeOptions]="store.pageSizeOptions()"
      (page)="onPageChange($event)"
    />
  `,
  styleUrls: ['./paginator.organism.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {class: 'organism'},
  hostDirectives: [
    {
      directive: PaginatorOrganismStore,
      inputs: ['form', 'pageSizeOptions', 'itemLength'],
    },
  ],
})
export class PaginatorOrganism extends NgAtomicComponent {
  protected store = inject(PaginatorOrganismStore);
  
  protected onPageChange(page: PageEvent) {
    this.store.form().patchValue({
      pageIndex: page.pageIndex,
      pageSize: page.pageSize
    });
  }

}
