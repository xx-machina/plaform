import { Injectable, inject } from '@angular/core';
import { FormBuilder } from '@angular/forms';

export interface PaginationFormValue {
  pageSize: number,
  pageIndex: number,
  length: number,
}

@Injectable({
  providedIn: 'root'
})
export class PaginationService {
  private fb = inject(FormBuilder);

  build({
    pageSize = 50,
    pageIndex = 0,
    length = 0,
  }: Partial<PaginationFormValue> = {}) {
    return this.fb.group({
      pageSize: [pageSize],
      pageIndex: [pageIndex],
      length: [length],
    });
  }
}
