import { NgModule } from '@angular/core';
import { PaginationPipe } from './pagination.pipe';

@NgModule({
  imports: [
    PaginationPipe,
  ],
  exports: [
    PaginationPipe
  ]
})
export class PaginationModule { }
